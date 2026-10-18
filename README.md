# Putahe

A restaurant product and category management project with a Laravel API and a web frontend.

**[Open the website preview](https://keichiis.github.io/Putahe/)**

The public preview shows a sample menu with search. Product editing and database features are available when running the Laravel project locally.

## Project folders

- `backend/`: Laravel application, API routes, migrations, and tests.
- `frontend/`: HTML, CSS, JavaScript, images, and Vite configuration.

## Local backend setup

Requires PHP 8.3 or newer with the extensions required by Composer, Composer, and SQLite support (or a configured MySQL database).

```powershell
git clone https://github.com/Keichiis/Putahe.git
cd Putahe/backend
composer install
Copy-Item .env.example .env
php artisan key:generate
New-Item -ItemType File -Path database/database.sqlite -Force
php artisan migrate
php artisan serve
```

Run Artisan commands from the `backend` folder. Configure database credentials in `backend/.env` if using MySQL instead of SQLite.

Open `http://127.0.0.1:8000` while the backend is running. The API is available at `/api/products` and `/api/categories`.

## Frontend

Laravel serves the frontend from `frontend/public/` directly; no local directory symlink is required. Its API connection is configured in `frontend/public/script.js`. Review that configuration for your local or hosted backend.

## Sharing

This repository shares the project source. Running the application online requires a separate PHP application host and database; GitHub Pages cannot run the Laravel backend.

GitHub Pages serves the read-only preview from `docs/`. After changing the frontend, rebuild the preview with `node frontend/pages/build.mjs` and commit the updated `docs/` files.

For the full website with a database, product/category editing, and image uploads, see [the backend hosting setup](DEPLOYMENT.md). A Dockerfile and Railway configuration are included. Backend deployment requires a connected hosting account.

Local environment files, dependencies, databases, runtime files, and logs are excluded from Git. Install dependencies and configure a local `.env` after cloning.
