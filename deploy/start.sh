#!/bin/sh
set -eu

: "${APP_KEY:?Set a persistent APP_KEY in your hosting environment.}"
: "${LARAVEL_STORAGE_PATH:=/data/storage}"
: "${PORT:=8080}"
export LARAVEL_STORAGE_PATH

case "$PORT" in
    ''|*[!0-9]*) echo 'PORT must be a number.' >&2; exit 1 ;;
esac

mkdir -p "$LARAVEL_STORAGE_PATH/app/private" \
    "$LARAVEL_STORAGE_PATH/app/public" \
    "$LARAVEL_STORAGE_PATH/framework/cache/data" \
    "$LARAVEL_STORAGE_PATH/framework/sessions" \
    "$LARAVEL_STORAGE_PATH/framework/views" \
    "$LARAVEL_STORAGE_PATH/logs" \
    /var/www/html/backend/bootstrap/cache

if [ "${DB_CONNECTION:-sqlite}" = sqlite ]; then
    : "${DB_DATABASE:=/data/database.sqlite}"
    export DB_DATABASE
    mkdir -p "$(dirname "$DB_DATABASE")"
    touch "$DB_DATABASE"
    chown www-data:www-data "$(dirname "$DB_DATABASE")" "$DB_DATABASE"
fi

chown -R www-data:www-data "$LARAVEL_STORAGE_PATH" /var/www/html/backend/bootstrap/cache

cd /var/www/html/backend
php artisan config:clear --no-interaction
php artisan migrate --force --no-interaction
php artisan storage:link --force --no-interaction
php artisan config:cache --no-interaction

# Apache workers need to write cache files created during startup.
chown -R www-data:www-data "$LARAVEL_STORAGE_PATH" /var/www/html/backend/bootstrap/cache

sed -i "s/^Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/:80>/:${PORT}>/" /etc/apache2/sites-available/000-default.conf
exec apache2-foreground
