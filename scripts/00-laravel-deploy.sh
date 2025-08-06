#!/usr/bin/env bash
echo "Running composer"
# Menggunakan --no-dev dan --optimize-autoloader adalah praktik terbaik untuk production
composer install --no-dev --no-interaction --optimize-autoloader --working-dir=/var/www/html

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

# echo "Running migrations..."
# php artisan migrate --force

# Jika Anda ingin menjalankan seeder, hapus tanda # di baris bawah ini
# echo "Running seeders..."
# php artisan db:seed --force