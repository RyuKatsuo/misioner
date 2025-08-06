#!/bin/sh

# Run Laravel setup
composer install --no-interaction --prefer-dist --optimize-autoloader

# NPM install and build (for React via Inertia)
npm install
npm run build

# Laravel permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Laravel artisan setup
php artisan config:cache
php artisan route:cache
php artisan view:cache
# php artisan migrate --force || true

# Start all services using supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
