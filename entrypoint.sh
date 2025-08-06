#!/bin/sh
set -e

mkdir -p /var/run/php
chown -R www-data:www-data /var/run/php

echo "Running Laravel startup script..."
cd /var/www/html

php artisan config:cache
php artisan route:cache
php artisan view:cache
# php artisan migrate --force

exec "$@"

echo "Startup script finished."
