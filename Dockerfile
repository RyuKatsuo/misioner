# Dockerfile Production untuk Laravel 12 + Inertia/React (Versi Final Diperbaiki)

# --- Tahap 1: PHP Base ---
FROM php:8.2-fpm AS base
# Pisahkan perintah untuk debugging dan caching yang lebih baik.
# 1. Update daftar paket
RUN apt-get update

# 2. Instal semua paket sistem yang dibutuhkan. libfreetype6-dev sudah ditambahkan.
RUN apt-get install -y \
    libpng-dev \
    libzip-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 3. Instal ekstensi PHP. Sekarang seharusnya berhasil karena semua dependensi sistem sudah ada.
RUN docker-php-ext-install pdo_mysql pdo_pgsql zip exif pcntl gd bcmath

# --- Tahap 2: Composer Dependencies ---
FROM base AS composer_dependencies
WORKDIR /app
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-dev --no-scripts --prefer-dist --optimize-autoloader

# --- Tahap 3: Node.js Dependencies ---
FROM node:18 AS node_dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Tahap 4: Production Image ---
FROM base AS production
WORKDIR /app

# Instal Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Salin artefak dari tahap-tahap sebelumnya
COPY --from=composer_dependencies /app/vendor ./vendor
COPY . .
COPY --from=node_dependencies /app/public/build ./public/build
COPY docker/nginx/default.conf /etc/nginx/sites-available/default
COPY docker/entrypoint/start.sh /start.sh
RUN chmod +x /start.sh

# Atur kepemilikan file
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80
ENTRYPOINT ["/start.sh"]