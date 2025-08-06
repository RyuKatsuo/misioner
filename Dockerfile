# --- TAHAP 1: BUILD FRONTEND (VITE + REACT) ---
FROM node:18 AS vite-builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Salin semua kode
COPY . .
RUN npm run build

# --- TAHAP 2: INSTALL DEPENDENSI LARAVEL ---
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

# --- TAHAP 3: PRODUKSI (NGINX + PHP-FPM) ---
FROM richarvey/nginx-php-fpm:1.7.2

# Salin source code Laravel
COPY . /var/www/html

# Salin hasil build Vite
COPY --from=vite-builder /app/public/build /var/www/html/public/build

# Salin folder vendor hasil composer
COPY --from=vendor-installer /app/vendor /var/www/html/vendor

# Salin konfigurasi nginx kustom
COPY conf/nginx/nginx-site.conf /etc/nginx/sites-available/default

# Salin dan aktifkan script deploy Laravel
COPY scripts/00-laravel-deploy.sh /etc/run-scripts.d/00-laravel-deploy.sh
RUN chmod +x /etc/run-scripts.d/00-laravel-deploy.sh

# Konfigurasi environment dari Render
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV COMPOSER_ALLOW_SUPERUSER 1

# Jalankan startup bawaan richarvey/nginx-php-fpm
CMD ["/start.sh"]
