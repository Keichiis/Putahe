FROM php:8.4-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends libicu-dev libonig-dev libsqlite3-dev libzip-dev unzip \
    && docker-php-ext-install -j"$(nproc)" intl mbstring pdo_mysql pdo_sqlite zip opcache \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html/backend
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts --no-autoloader

COPY backend/ ./
COPY frontend/public/ /var/www/html/frontend/public/
RUN composer dump-autoload --no-dev --optimize --no-scripts

COPY deploy/apache.conf /etc/apache2/sites-available/000-default.conf
COPY deploy/php.ini /usr/local/etc/php/conf.d/putahe.ini
COPY deploy/start.sh /usr/local/bin/putahe-start
RUN sed -i 's/\r$//' /usr/local/bin/putahe-start \
    && chmod +x /usr/local/bin/putahe-start

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    DB_CONNECTION=sqlite \
    DB_DATABASE=/data/database.sqlite \
    LARAVEL_STORAGE_PATH=/data/storage \
    CACHE_STORE=file \
    SESSION_DRIVER=file \
    QUEUE_CONNECTION=sync \
    PORT=8080

EXPOSE 8080
CMD ["/usr/local/bin/putahe-start"]
