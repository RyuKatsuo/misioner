FROM php:8.3-fpm-alpine

# Set timezone
ENV TZ=Asia/Jakarta

# Set working directory
WORKDIR /var/www/html

# Install system dependencies & PHP extensions
RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    curl \
    git \
    zip \
    unzip \
    libpng \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libwebp-dev \
    oniguruma-dev \
    libxml2-dev \
    icu-dev \
    nodejs \
    npm \
    postgresql-dev \
    libzip-dev \
    zlib-dev \
    && docker-php-ext-install pdo pdo_mysql zip intl opcache \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Copy configuration files
COPY conf.d/nginx/default.conf /etc/nginx/http.d/default.conf
COPY conf.d/php/php.ini /usr/local/etc/php/conf.d/php.ini
COPY conf.d/supervisord.conf /etc/supervisord.conf

# Copy Laravel project
COPY . /var/www/html

# Set permissions
RUN addgroup -g 1000 www \
    && adduser -u 1000 -G www -s /bin/sh -D www-data \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port
EXPOSE 80

# Copy entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Start container
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
