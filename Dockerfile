# Dockerfile Final (dengan perbaikan ext-gd)

# --- TAHAP 1: BUILD FRONTEND (VITE) ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- TAHAP 2: PHP BASE ---
# Fondasi PHP kita yang berisi semua ekstensi.
FROM php:8.2-fpm-alpine AS php-base
# Instal paket sistem dan semua ekstensi PHP yang kita butuhkan.
RUN apk add --no-cache \
    bash \
    git \
    curl \
    zlib-dev \
    libpng-dev \
    jpeg-dev \
    freetype-dev \
    libwebp-dev \
    oniguruma-dev \
    libxml2-dev \
    postgresql-dev \
    nodejs \
    npm \
    php82 \
    php82-fpm \
    php82-pdo \
    php82-pdo_pgsql \
    php82-mbstring \
    php82-tokenizer \
    php82-xml \
    php82-curl \
    php82-dom \
    php82-fileinfo \
    php82-json \
    php82-session \
    php82-ctype \
    php82-openssl \
    php82-zip \
    php82-phar \
    php82-posix \
    php82-opcache \
    php82-simplexml \
    php82-gd
    
# Instal Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# --- TAHAP 3: BUILD DEPENDENSI PHP (COMPOSER) ---
# Dimulai dari 'php-base', jadi semua ekstensi sudah ada.
FROM php-base AS composer-builder
WORKDIR /app
COPY database/ database/
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --optimize-autoloader

# --- TAHAP 4: IMAGE PRODUKSI ---
# Dimulai dari 'php-base' yang bersih.
FROM php-base AS production-image
WORKDIR /var/www/html

# Instal Nginx dan Supervisor
RUN apk add --no-cache nginx supervisor

# Salin kode aplikasi dari konteks build saat ini
COPY . .

# Salin artefak dari tahap-tahap build sebelumnya
COPY --from=composer-builder /app/vendor/ ./vendor/
COPY --from=frontend-builder /app/public/build/ ./public/build/

# Salin semua file konfigurasi
COPY conf.d/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY conf.d/nginx/default.conf /etc/nginx/http.d/default.conf
COPY conf.d/php-fpm/php-fpm.conf /etc/php82/php-fpm.d/www.conf
COPY conf.d/php/opcache.ini /etc/php82/conf.d/opcache.ini

# Salin dan beri izin eksekusi pada entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Atur kepemilikan folder
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]