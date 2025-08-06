FROM php:8.2-fpm-alpine

# Install sistem dependencies dan PHP extensions
RUN apk add --no-cache \
    nginx \
    bash \
    curl \
    git \
    unzip \
    php82 \
    php82-fpm \
    php82-pdo \
    php82-pdo_mysql \
    php82-mbstring \
    php82-tokenizer \
    php82-xml \
    php82-curl \
    php82-dom \
    php82-fileinfo \
    php82-json \
    php82-session \
    php82-ctype \
    php82-gd \
    php82-openssl \
    php82-zip \
    php82-phar \
    php82-posix \
    php82-opcache \
    php82-simplexml

# Install Composer secara global
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Buat direktori untuk Laravel
WORKDIR /var/www/html

# Salin file project Laravel
COPY . /var/www/html

# Pastikan permission benar
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Salin file deploy script
COPY 00-laravel-deploy /00-laravel-deploy
RUN chmod +x /00-laravel-deploy

# Jalankan deploy script
RUN scripts/00-laravel-deploy.sh

# Salin konfigurasi nginx
COPY conf/nginx/nginx-site.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx + php-fpm
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
