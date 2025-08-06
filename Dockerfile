# Base PHP image
FROM php:8.3-fpm-alpine

# Set working directory
WORKDIR /opt/laravel

# Environment
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="./vendor/bin:/root/.composer/vendor/bin:$PATH"

# Install dependencies
RUN apk add --no-cache \
    bash \
    nginx \
    supervisor \
    curl \
    git \
    unzip \
    libzip-dev \
    icu-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    nodejs \
    npm \
    yarn \
    tzdata \
    shadow \
    && docker-php-ext-install pdo pdo_mysql zip intl opcache \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Laravel global tools (optional)
RUN composer global require laravel/installer

# Install Laravel app dependencies
COPY . /opt/laravel
RUN composer install --no-dev --optimize-autoloader

# Frontend build (React + Vite)
RUN yarn install && yarn build

# Copy nginx and supervisor configuration
COPY conf.d/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY conf.d/supervisor/supervisord.conf /etc/supervisord.conf
COPY conf.d/php/php.ini /usr/local/etc/php/conf.d/php.ini
COPY conf.d/php-fpm/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

# Set permissions
RUN addgroup -g 1000 www && adduser -u 1000 -G www -s /bin/sh -D www-data \
    && chown -R www-data:www-data /opt/laravel \
    && chmod -R 755 /opt/laravel/storage /opt/laravel/bootstrap/cache

# Cron setup
RUN touch /var/log/cron.log \
    && echo "* * * * * /usr/local/bin/php /opt/laravel/artisan schedule:run >> /var/log/cron.log 2>&1" | crontab -

# Expose HTTP port
EXPOSE 80

# Add entrypoint script
COPY entrypoint.sh /root/entrypoint.sh
RUN chmod +x /root/entrypoint.sh

ENTRYPOINT ["/root/entrypoint.sh"]
