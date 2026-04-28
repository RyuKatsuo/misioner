# =================================================================
# Dockerfile Definitif untuk Laravel, Vite, dan Supabase (PostgreSQL)
# =================================================================

# --- TAHAP 1: BUILD FRONTEND (VITE) ---
# Menggunakan Node.js untuk meng-compile aset frontend
# -----------------------------------------------------------------
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# --- TAHAP 2: BUILDER PHP (COMPOSER + EXTENSIONS) ---
# Menginstal dependensi Composer dan meng-compile ekstensi PHP
# -----------------------------------------------------------------
FROM php:8.2-fpm-alpine AS builder
WORKDIR /app

# Instal semua dependensi build: library -dev DAN build-tools
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
    postgresql-dev

# Konfigurasi ekstensi yang memerlukan opsi khusus (seperti GD)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp

# Instal HANYA ekstensi yang benar-benar perlu di-compile
RUN docker-php-ext-install -j$(nproc) \
    pdo_pgsql \
    pgsql \
    gd \
    zip \
    mbstring \
    exif \
    pcntl \
    bcmath \
    opcache

# Instal Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Salin file composer dan jalankan install
COPY database/ database/
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --optimize-autoloader


# --- TAHAP 3: IMAGE PRODUKSI FINAL ---
# Merakit image akhir yang ramping dengan semua yang dibutuhkan untuk runtime
# -----------------------------------------------------------------
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
# Pastikan Anda memiliki file .dockerignore agar tidak menyalin folder yang tidak perlu
COPY . .

# Salin artefak dari tahap-tahap build lainnya
COPY --from=builder /app/vendor/ ./vendor/
COPY --from=frontend-builder /app/public/build/ ./public/build/

# Salin semua file konfigurasi ke path yang benar
COPY conf.d/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY conf.d/nginx/default.conf /etc/nginx/http.d/default.conf
COPY conf.d/php-fpm/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
COPY conf.d/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Salin dan beri izin eksekusi pada entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Atur kepemilikan folder agar bisa ditulis oleh PHP-FPM dan Worker
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port (meskipun Render menggunakan port dinamis, ini adalah praktik yang baik)
EXPOSE 80

# Gunakan entrypoint untuk konfigurasi dinamis saat runtime
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Jalankan supervisord sebagai perintah utama
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]