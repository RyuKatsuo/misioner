# Dockerfile yang dimodifikasi untuk Laravel + Vite + Render Official Setup

# --- TAHAP 1: BUILD FRONTEND ASSETS ---
# Kita gunakan image Node.js untuk menjalankan npm install & npm run build.
FROM node:18 AS vite-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- TAHAP 2: PRODUCTION IMAGE ---
# Sekarang kita gunakan image dari contoh Render sebagai dasar.
FROM richarvey/nginx-php-fpm:1.7.2

# Salin KODE APLIKASI dari konteks lokal Anda.
# Kita tidak menyalin node_modules atau file-file yang tidak perlu.
COPY . /var/www/html

# Salin HANYA ASET yang sudah di-build dari tahap 1.
# Ini akan menempatkan folder 'build' di dalam direktori 'public' image kita.
COPY --from=vite-builder /app/public/build /var/www/html/public/build

# Tetapkan environment variables seperti di contoh Render
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV COMPOSER_ALLOW_SUPERUSER 1

# Perintah CMD tetap sama
CMD ["/start.sh"]