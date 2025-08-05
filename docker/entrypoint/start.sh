#!/bin/sh

# Jalankan migrasi database
php artisan migrate --force --seed

# Mulai PHP-FPM di background
php-fpm -D

# Mulai Nginx di foreground
nginx -g "daemon off;"