# Production deployment

This project runs its Laravel application on Vercel and uses a hosted MySQL database from Railway.

## 1. Create the Railway database

1. Create a Railway project at https://railway.app.
2. Add a MySQL service using the MySQL template.
3. Open the MySQL service's **Variables** tab and keep these values available:
   `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, and `MYSQLPASSWORD`.

## 2. Configure Vercel

Import this GitHub repository into Vercel and add these production environment variables:

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your-generated-key
APP_URL=https://your-project.vercel.app
APP_STORAGE=/tmp
LOG_CHANNEL=stderr

DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
```

Replace each `${MYSQL...}` value with the matching value from Railway. Vercel does not automatically resolve Railway variable names across separate projects.

Generate the application key locally without changing `.env`:

```powershell
php artisan key:generate --show
```

Copy the result into Vercel's `APP_KEY` variable. Do not commit `.env` or database credentials.

## 3. Run the production migrations

From PowerShell, temporarily set the Railway values in the current terminal session:

```powershell
$env:DB_CONNECTION = 'mysql'
$env:DB_HOST = 'your-railway-mysql-host'
$env:DB_PORT = '3306'
$env:DB_DATABASE = 'your-railway-database'
$env:DB_USERNAME = 'your-railway-username'
$env:DB_PASSWORD = 'your-railway-password'
php artisan migrate --force
```

The environment variables disappear when that terminal closes. After migration completes, redeploy Vercel.

## 4. Verify the deployment

Open these URLs, replacing the domain:

```text
https://your-project.vercel.app/
https://your-project.vercel.app/api/products
```

The second URL should return a JSON array. The product page should then load the same data.