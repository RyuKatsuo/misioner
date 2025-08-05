# Dockerfile untuk Laravel 12 + Inertia/React

# --- TAHAP 1: BUILDER ---
# Tahap ini kita gunakan untuk menginstal semua dependensi dan membangun aset.
# Kita menggunakan image yang sudah berisi PHP, Composer, dan Node.js.
FROM aevitas/php-node:8.2-fpm-bullseye AS builder

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Instal dependensi sistem yang dibutuhkan oleh Laravel & Composer
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip exif pcntl gd bcmath

# Salin file composer terlebih dahulu untuk caching
COPY composer.json composer.lock ./
# Instal dependensi PHP
RUN composer install --no-dev --no-interaction --no-plugins --no-scripts --prefer-dist

# Salin file package.json terlebih dahulu untuk caching
COPY package.json package-lock.json ./
# Instal dependensi Node.js
RUN npm install

# Salin seluruh sisa kode aplikasi
COPY . .

# Build aset frontend (React/Vite)
RUN npm run build

# Optimasi Laravel untuk production
RUN composer install --no-dev --optimize-autoloader
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache


# --- TAHAP 2: PRODUCTION ---
# Tahap ini kita gunakan untuk membuat image final yang bersih dan ringan.
# Kita mulai dari image PHP-FPM yang bersih.
FROM php:8.2-fpm-bullseye AS production

WORKDIR /app

# Instal dependensi sistem yang hanya dibutuhkan untuk production (seperti Nginx)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libzip-dev \
    nginx \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip exif pcntl gd bcmath

# Salin file-file yang sudah di-build dari tahap 'builder'
COPY --from=builder /app .

# Salin konfigurasi Nginx yang akan kita buat nanti
COPY docker/nginx/default.conf /etc/nginx/sites-enabled/default

# Salin entrypoint script yang akan kita buat nanti
COPY docker/entrypoint/start.sh /start.sh
RUN chmod +x /start.sh

# Atur kepemilikan file agar Nginx dan PHP bisa menulis ke folder storage
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Expose port 80 untuk Nginx
EXPOSE 80

# Perintah untuk menjalankan aplikasi saat container dimulai
ENTRYPOINT ["/start.sh"]