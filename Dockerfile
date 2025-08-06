# Dockerfile Definitif untuk Laravel, Vite, Supabase di Alpine

# --- TAHAP 1: BUILD FRONTEND (VITE) ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- TAHAP 2: PHP BASE & DEPENDENSI COMPOSER ---
# Kita gabungkan tahap PHP dan Composer agar lebih sederhana dan konsisten
FROM php:8.2-fpm-alpine AS composer-builder
WORKDIR /app

# Instal HANYA library sistem (-dev) yang dibutuhkan untuk meng-compile ekstensi PHP
RUN apk add --no-cache \
    bash \
    git \
    unzip \
    zip \
    # Dependensi untuk ekstensi GD
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libwebp-dev \
    # Dependensi untuk ekstensi lain
    libzip-dev \
    oniguruma-dev \
    libxml2-dev \
    postgresql-dev

# SEKARANG, gunakan cara yang benar untuk menginstal ekstensi pada image ini
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd zip opcache posix simplexml tokenizer fileinfo ctype dom curl xml

# Instal Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Salin file composer dan jalankan install
COPY database/ database/
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --optimize-autoloader

# --- TAHAP 3: IMAGE PRODUKSI ---
# Mulai dari image PHP dasar yang sama, tapi kita hanya instal paket runtime
FROM php:8.2-fpm-alpine
WORKDIR /var/www/html

# Instal paket yang hanya dibutuhkan untuk RUNTIME, bukan build
RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    # Library non-dev untuk GD
    libjpeg-turbo \
    libpng \
    freetype \
    libwebp

# Salin PHP dan ekstensinya yang sudah terinstal dari base image kita
COPY --from=composer-builder /usr/local/etc/php /usr/local/etc/php
COPY --from=composer-builder /usr/local/sbin /usr/local/sbin
COPY --from=composer-builder /usr/local/bin /usr/local/bin

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