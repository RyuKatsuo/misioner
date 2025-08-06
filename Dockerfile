# --- TAHAP 1: BUILD FRONTEND (VITE) ---
FROM node:18 AS vite-builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Salin semua file source code
COPY . .

# Jalankan build frontend
RUN npm run build

# --- TAHAP 2: INSTALL DEPENDENSI PHP ---
FROM composer:2 AS vendor-installer
WORKDIR /app

# Salin semua file (termasuk composer.json)
COPY . .

# Install dependensi tanpa dev, untuk production
RUN composer install --no-dev --optimize-autoloader --no-interaction

# --- TAHAP 3: FINAL IMAGE UNTUK PRODUKSI ---
FROM richarvey/nginx-php-fpm:1.7.2

# Salin kode aplikasi Laravel
COPY . /var/www/html

# Salin hasil build Vite dari tahap pertama
COPY --from=vite-builder /app/public/build /var/www/html/public/build

# Salin folder vendor dari tahap composer
COPY --from=vendor-installer /app/vendor /var/www/html/vendor

# (Optional) Salin file konfigurasi NGINX jika kamu punya
COPY conf/nginx/nginx-site.conf /etc/nginx/sites-available/default

# Tambahkan environment variables Render
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV COMPOSER_ALLOW_SUPERUSER 1

# Jalankan script Laravel jika ingin
RUN php /var/www/html/artisan config:cache && \
    php /var/www/html/artisan route:cache

# Jalankan service
CMD ["/start.sh"]
