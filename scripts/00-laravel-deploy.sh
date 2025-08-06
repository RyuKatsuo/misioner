#!/bin/sh
set -e

echo "==> Running Laravel Setup Script at Runtime..."

# Pindah ke direktori kerja yang benar
cd /var/www/html

echo "==> Caching configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Running migrations..."
# php artisan migrate --force

# Anda bisa menambahkan 'php artisan db:seed --force' di sini jika perlu

echo "==> Setup complete. Starting servers..."