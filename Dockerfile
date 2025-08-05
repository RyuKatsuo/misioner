# Dockerfile Production untuk Laravel 12 + Inertia/React (Versi Revisi)

# --- Tahap 1: PHP Base ---
# Menggunakan tag php:8.2-fpm sesuai permintaan.
FROM php:8.2-fpm AS base
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libzip-dev \
    libjpeg-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip exif pcntl gd bcmath

# --- Tahap 2: Composer Dependencies ---
# Image terpisah hanya untuk menginstal dependensi Composer.
FROM base AS composer_dependencies
WORKDIR /app
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-dev --no-scripts --prefer-dist --optimize-autoloader

# --- Tahap 3: Node.js Dependencies ---
# Image terpisah hanya untuk menginstal dan membangun aset frontend.
# Menggunakan tag node:18 untuk konsistensi.
FROM node:18 AS node_dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Tahap 4: Production Image ---
# Ini adalah image final yang akan kita deploy.
# Kita mulai dari image 'base' yang bersih.
FROM base AS production
WORKDIR /app

# Instal Nginx
RUN apt-get update && apt-get install -y nginx

# Salin dependensi Composer dari tahap 'composer_dependencies'
COPY --from=composer_dependencies /app/vendor ./vendor

# Salin kode aplikasi
COPY . .

# Salin aset frontend yang sudah di-build dari tahap 'node_dependencies'
COPY --from=node_dependencies /app/public/build ./public/build

# Salin konfigurasi Nginx dan script entrypoint
COPY docker/nginx/default.conf /etc/nginx/sites-available/default
COPY docker/entrypoint/start.sh /start.sh
RUN chmod +x /start.sh

# Atur kepemilikan file agar Nginx dan PHP bisa menulis ke folder yang dibutuhkan
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80
ENTRYPOINT ["/start.sh"]