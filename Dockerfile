# TAHAP 1: BUILD FRONTEND (REACT/VITE)
FROM node:18 AS vite-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# TAHAP 2: INSTALL DEPENDENSI LARAVEL (composer)
FROM php:8.2-fpm AS php-builder
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    unzip \
    git \
    zip \
    libpng-dev \
    libjpeg-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-interaction

# TAHAP 3: FINAL IMAGE DENGAN NGINX + PHP 8.2-FPM
FROM nginx:stable-alpine AS final
WORKDIR /var/www/html

# Copy konfigurasi nginx
COPY conf/nginx/nginx-site.conf /etc/nginx/conf.d/default.conf

# Install PHP-FPM
RUN apk add --no-cache php8 php8-fpm php8-opcache php8-pdo php8-pdo_mysql \
    php8-mbstring php8-tokenizer php8-xml php8-curl php8-dom php8-fileinfo \
    php8-json php8-session php8-ctype php8-gd php8-openssl php8-zip

# Copy source code Laravel
COPY . /var/www/html

# Copy folder vendor dari builder
COPY --from=php-builder /var/www/html/vendor /var/www/html/vendor

# Copy hasil build Vite ke public/
COPY --from=vite-builder /app/public/build /var/www/html/public/build

# Jalankan script deploy Laravel
COPY scripts/00-laravel-deploy.sh /docker-entrypoint.d/00-laravel-deploy.sh
RUN chmod +x /docker-entrypoint.d/00-laravel-deploy.sh

# Expose port 80
EXPOSE 80

# Jalankan NGINX dan PHP-FPM saat container berjalan
CMD ["/bin/sh", "-c", "php-fpm8 & nginx -g 'daemon off;'"]
