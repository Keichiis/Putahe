# Production deployment

This project runs its Laravel application on Vercel and uses a hosted MySQL database from Aiven.

## 1. Create the Aiven database

1. Create an account at https://console.aiven.io.
2. Create a new **MySQL** service and choose the region and plan.
3. Open the service's **Overview** or **Connection information** panel and keep these values available:
   `Host`, `Port`, `Database`, `User`, and `Password`.
4. Download Aiven's **CA certificate** from the service's connection information panel.

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
MYSQL_ATTR_SSL_CA_CONTENT=your-aiven-ca-certificate-content
```

Replace the placeholders with Aiven's connection values. Paste the complete downloaded CA certificate, including `BEGIN CERTIFICATE` and `END CERTIFICATE` lines, into Vercel as `MYSQL_ATTR_SSL_CA_CONTENT`. The Vercel entrypoint writes it to temporary storage for Laravel's MySQL client.

Generate the application key locally without changing `.env`:

```powershell
php artisan key:generate --show
```

Copy the result into Vercel's `APP_KEY` variable. Do not commit `.env` or database credentials.

## 3. Run the production migrations

From PowerShell, temporarily set the Aiven values in the current terminal session:

```powershell
$env:DB_CONNECTION = 'mysql'
$env:DB_HOST = 'your-aiven-mysql-host'
$env:DB_PORT = 'your-aiven-mysql-port'
$env:DB_DATABASE = 'your-aiven-database'
$env:DB_USERNAME = 'your-aiven-username'
$env:DB_PASSWORD = 'your-aiven-password'
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