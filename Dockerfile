# Menggunakan Alpine Linux untuk image yang lebih kecil
FROM php:8.2-fpm-alpine

# Install sistem dependencies dan PHP extensions
# Menambahkan libpq-dev untuk support PostgreSQL (Supabase)
RUN apk add --no-cache \
    nginx \
    bash \
    curl \
    git \
    unzip \
    php82-fpm \
    php82-pdo \
    php82-pdo_pgsql \
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

# Buat direktori untuk Laravel dan jadikan direktori kerja
WORKDIR /var/www/html

# Salin file composer dan install dependensi (untuk caching yang lebih baik)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --optimize-autoloader

# Salin sisa file project Laravel
COPY . .

# Pastikan permission benar untuk folder yang bisa ditulis oleh Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Salin file deploy script ke lokasi yang standar (/usr/local/bin) dan beri izin eksekusi
COPY scripts/00-laravel-deploy.sh /usr/local/bin/deploy.sh
RUN chmod +x /usr/local/bin/deploy.sh

# Salin konfigurasi nginx
COPY conf/nginx/nginx-site.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# PERUBAHAN UTAMA: Jalankan deploy script DULU, BARU jalankan server.
# Ini semua terjadi saat runtime.
CMD ["sh", "-c", "/usr/local/bin/deploy.sh && php-fpm -D && nginx -g 'daemon off;'"]