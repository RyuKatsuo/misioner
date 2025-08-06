# Dockerfile Definitif (Final) untuk Laravel, Vite, Supabase di Alpine

# --- TAHAP 1: BUILD FRONTEND (VITE) ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- TAHAP 2: BUILDER PHP (COMPOSER + EXTENSIONS) ---
FROM php:8.2-fpm-alpine AS builder
WORKDIR /app

# Instal semua dependensi build: library -dev DAN build-tools (bison, re2c)
RUN apk add --no-cache \
    bash \
    git \
    unzip \
    zip \
    # Build tools yang dibutuhkan untuk kompilasi ekstensi
    $PHPIZE_DEPS \
    bison \
    re2c \
    # Library sistem yang dibutuhkan ekstensi
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libwebp-dev \
    libzip-dev \
    oniguruma-dev \
    libxml2-dev \
    postgresql-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install gd zip pdo pdo_pgsql pgsql mbstring xml

# Sekarang, gunakan docker-php-ext-install. Ini akan berhasil karena peralatannya sudah ada.
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd zip opcache posix simplexml

# Instal Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Salin file composer dan jalankan install
COPY database/ database/
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --optimize-autoloader

# --- TAHAP 3: IMAGE PRODUKSI ---
FROM php:8.2-fpm-alpine
WORKDIR /var/www/html

# Instal paket yang hanya dibutuhkan untuk RUNTIME, bukan build
RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    # Library runtime (non-dev)
    libjpeg-turbo \
    libpng \
    freetype \
    libwebp \
    libzip \
    oniguruma \
    libxml2 \
    postgresql-libs

# Salin PHP, ekstensinya, dan Composer yang sudah terinstal dari tahap builder
COPY --from=builder /usr/local/etc/php /usr/local/etc/php
COPY --from=builder /usr/local/sbin /usr/local/sbin
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /usr/local/lib/php /usr/local/lib/php

# Salin kode aplikasi dari konteks build saat ini
COPY . .

# Salin artefak dari tahap-tahap build lainnya
COPY --from=builder /app/vendor/ ./vendor/
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
# RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]