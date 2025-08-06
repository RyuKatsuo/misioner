# --- TAHAP 1: BUILD FRONTEND (VITE) ---
FROM node:18 AS vite-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- TAHAP 2: IMAGE PRODUKSI ---
# Kita sederhanakan, tidak perlu tahap 'vendor-installer' terpisah.
# Image richarvey sudah termasuk PHP dan Composer.
FROM richarvey/nginx-php-fpm:1.7.2

# Instal dependensi sistem untuk PostgreSQL
# PENTING: Image ini sudah punya banyak ekstensi, tapi kita pastikan pgsql ada.
# Skrip di dalam image ini akan otomatis menginstal ekstensi dari env var.
ENV PHP_EXTENSION_PDO_PGSQL 1
ENV PHP_EXTENSION_PGSQL 1

# Salin semua file kode aplikasi
COPY . /var/www/html

# Salin aset frontend yang sudah di-build
COPY --from=vite-builder /app/public/build /var/www/html/public/build

# Salin file konfigurasi Nginx dan skrip deploy
COPY conf/nginx/nginx-site.conf /etc/nginx/sites-available/default
COPY scripts/00-laravel-deploy.sh /var/www/html/scripts/00-laravel-deploy.sh

# Atur environment variable untuk mengontrol image
ENV SKIP_COMPOSER 1 # Kita akan menjalankan composer di dalam skrip kita
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1 # Ini yang akan menjalankan 00-laravel-deploy.sh
ENV REAL_IP_HEADER 1
ENV COMPOSER_ALLOW_SUPERUSER 1

# PERINTAH ARTISAN DIHAPUS DARI SINI
# Cache akan dijalankan oleh skrip 00-laravel-deploy.sh saat runtime

CMD ["/start.sh"]