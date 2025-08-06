# --- TAHAP 1: BUILD FRONTEND (VITE) ---
FROM node:18 AS vite-builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- TAHAP 2: INSTALL DEPENDENSI PHP + COMPOSER ---
FROM php:8.2-cli AS vendor-installer
WORKDIR /app

# Install ekstensi PHP yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    zip \
    libpng-dev \
    libjpeg-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip gd

# Install Composer dari image resmi
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy source code Laravel
COPY . .

# Jalankan composer install
RUN composer install --no-dev --optimize-autoloader --no-interaction

# --- TAHAP 3: IMAGE PRODUKSI ---
FROM richarvey/nginx-php-fpm:1.7.2

COPY . /var/www/html
COPY --from=vite-builder /app/public/build /var/www/html/public/build
COPY --from=vendor-installer /app/vendor /var/www/html/vendor

# Konfigurasi nginx
COPY conf/nginx/nginx-site.conf /etc/nginx/sites-available/default

# Environment variable dari Render
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV COMPOSER_ALLOW_SUPERUSER 1

# Cache konfigurasi Laravel
RUN php /var/www/html/artisan config:cache && \
    php /var/www/html/artisan route:cache

CMD ["/start.sh"]
