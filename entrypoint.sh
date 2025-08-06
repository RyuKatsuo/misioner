#!/bin/sh
set -e

# --- 1. Konfigurasi Port Nginx Dinamis untuk Render ---
# Mengganti placeholder __PORT__ di file config Nginx dengan nilai dari $PORT
# Jika $PORT tidak ada (saat development lokal), gunakan port 80 sebagai default.
echo "Configuring Nginx port for Render..."
sed -i "s/__PORT__/${PORT:-80}/g" /etc/nginx/http.d/default.conf


# --- 2. Siapkan Direktori Socket PHP-FPM ---
# Membuat direktori untuk file socket PHP-FPM jika belum ada.
echo "Preparing PHP-FPM socket directory..."
mkdir -p /var/run/php

# Mengatur kepemilikan direktori agar proses php-fpm bisa menulis di sana.
# Ini penting jika php-fpm berjalan sebagai user www-data.
chown -R www-data:www-data /var/run/php


# --- 3. Optimasi Laravel ---
# Pindah ke direktori aplikasi sebelum menjalankan perintah artisan.
cd /var/www/html

# Membuat cache untuk config, route, dan view untuk mempercepat aplikasi.
echo "Running Laravel optimizations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache


# --- 4. Jalankan Perintah Utama ---
# 'exec "$@"' akan menjalankan perintah default dari Dockerfile (yaitu, supervisord).
# Ini harus menjadi baris terakhir yang dieksekusi.
echo "Starting main process (supervisord)..."
exec "$@"