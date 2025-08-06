#!/bin/sh
set -e

echo "Running Laravel startup script..."
cd /var/www/html

php artisan config:cache
php artisan route:cache
php artisan view:cache
# php artisan migrate --force

echo "Startup script finished."