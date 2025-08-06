#!/bin/sh
set -e

# =================================================================
# BAGIAN DEBUG: Cetak isi file konfigurasi penting ke log
# Ini akan menunjukkan kepada kita apa yang sebenarnya ada di dalam kontainer
# =================================================================
echo "================================================="
echo "DEBUG: Checking Nginx site configuration..."
echo "--- Contents of /etc/nginx/http.d/default.conf ---"
cat /etc/nginx/http.d/default.conf
echo "-------------------------------------------------"

echo "DEBUG: Checking PHP-FPM pool configuration..."
echo "--- Contents of /usr/local/etc/php-fpm.d/www.conf ---"
cat /usr/local/etc/php-fpm.d/www.conf
echo "-------------------------------------------------"
echo "================================================="
# =================================================================


# --- 1. Konfigurasi Port Nginx Dinamis untuk Render ---
echo "Configuring Nginx port for Render..."
sed -i "s/__PORT__/${PORT:-80}/g" /etc/nginx/http.d/default.conf


# --- 2. Siapkan Direktori Socket PHP-FPM ---
echo "Preparing PHP-FPM socket directory..."
mkdir -p /var/run/php
chown -R www-data:www-data /var/run/php


# --- 3. Optimasi Laravel ---
cd /var/www/html
echo "Running Laravel optimizations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache


# --- 4. Jalankan Perintah Utama ---
echo "Starting main process (supervisord)..."
exec "$@"