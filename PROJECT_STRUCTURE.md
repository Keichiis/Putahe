# Project Structure - Putahe

## Overview
This project has been reorganized into a clear **Backend** and **Frontend** separation for better maintainability and development workflow.

---

## 📁 Directory Structure

### Root Directory `/`
Contains configuration files and documentation:
- `.editorconfig` - Editor configuration
- `.env` files - Located in `backend/`
- `.gitattributes` - Git attributes
- `.gitignore` - Git ignore rules
- `.phpunit.result.cache` - PHPUnit cache
- `README.md` - Project documentation
- `PRESENTATION.md` - Project presentation
- `QUICK_START.md` - Quick start guide
- Other documentation files

---

## 🔧 Backend Directory `/backend`

### Purpose
Contains all server-side code, configuration, and dependencies.

### Structure
```
backend/
├── api/                    # API entry point
├── app/                    # Laravel application
│   ├── Http/
│   │   └── Controllers/    # API Controllers
│   │       ├── ProductController.php
│   │       ├── CategoryController.php
│   │       └── Controller.php
│   ├── Models/             # Data Models
│   │   ├── Product.php
│   │   ├── Category.php
│   │   └── User.php
│   └── Providers/          # Service Providers
│       └── AppServiceProvider.php
├── bootstrap/              # Bootstrap files
├── config/                 # Configuration files
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── database.php
│   ├── filesystems.php
│   ├── logging.php
│   ├── mail.php
│   ├── queue.php
│   ├── sanctum.php
│   ├── services.php
│   └── session.php
├── database/               # Database files
│   ├── migrations/         # Database migrations
│   ├── seeders/           # Database seeders
│   ├── factories/         # Model factories
│   └── database.sqlite    # SQLite database
├── routes/                 # Route definitions
│   ├── api.php            # API routes
│   ├── web.php            # Web routes
│   └── console.php        # Console routes
├── storage/               # Storage directory
│   ├── app/              # Application storage
│   ├── framework/        # Framework storage
│   └── logs/             # Application logs
├── tests/                 # Test files
│   ├── Feature/          # Feature tests
│   │   ├── ProductApiTest.php
│   │   ├── CategoryApiTest.php
│   │   └── ExampleTest.php
│   ├── Unit/             # Unit tests
│   │   └── ExampleTest.php
│   └── TestCase.php
├── vendor/               # PHP dependencies (Composer packages)
├── artisan              # Laravel CLI tool
├── composer.json        # PHP dependencies manifest
├── composer.lock        # PHP dependencies lock file
├── phpunit.xml         # PHPUnit configuration
├── .env                # Environment variables (local)
└── .env.example        # Example environment variables
```

### Key Files
- **`app/Http/Controllers/`** - API endpoints for products and categories
- **`app/Models/`** - Database models (Product, Category, User)
- **`routes/api.php`** - API route definitions
- **`database/migrations/`** - Database schema migrations
- **`tests/`** - Automated tests for backend functionality

---

## 🎨 Frontend Directory `/frontend`

### Purpose
Contains all client-side code, assets, and frontend configuration.

### Structure
```
frontend/
├── public/                 # Public web root
│   ├── index.html         # Main HTML file
│   ├── index.php          # PHP entry point
│   ├── script.js          # Frontend JavaScript
│   ├── style.css          # Frontend CSS
│   ├── assets/            # Static assets
│   ├── favicon.ico        # Favicon
│   ├── robots.txt         # Robots file
│   ├── .htaccess          # Apache configuration
│   └── storage/           # Public storage symlink
├── resources/              # Source resources
│   ├── js/                # JavaScript source files
│   │   └── app.js
│   ├── css/               # CSS source files
│   │   └── app.css
│   └── views/             # Blade templates
│       └── welcome.blade.php
├── vite.config.js         # Vite build configuration
├── package.json           # NPM dependencies manifest
└── .npmrc                 # NPM configuration
```

### Key Files
- **`public/index.html`** - Main frontend HTML
- **`public/script.js`** - Frontend JavaScript logic
- **`public/style.css`** - Frontend styling
- **`resources/js/`** - JavaScript source files
- **`resources/css/`** - CSS source files
- **`package.json`** - NPM dependencies (Vue, React, etc.)

---

## 📦 Folder Size Statistics

| Folder | Size |
|--------|------|
| Backend | ~73.44 MB |
| Frontend | ~3.11 MB |
| **Total** | **~76.55 MB** |

---

## 🚀 Development Workflow

### Backend Development
```bash
cd backend

# Install PHP dependencies
composer install

# Run migrations
php artisan migrate

# Start development server
php artisan serve

# Run tests
php artisan test
```

### Frontend Development
```bash
cd frontend

# Install NPM dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📋 File Organization Summary

### ✅ Backend Files (15 items)
- Directories: api, app, bootstrap, config, database, routes, storage, tests, vendor
- Files: artisan, composer.json, composer.lock, phpunit.xml, .env, .env.example

### ✅ Frontend Files (5 items)
- Directories: public, resources
- Files: vite.config.js, package.json, .npmrc

### ✅ Root Files (Configuration & Documentation)
- .editorconfig
- .gitattributes
- .gitignore
- README.md
- PRESENTATION.md
- QUICK_START.md
- .git (version control)

---

## 🔄 Git Integration

The `.git` directory remains in the root for version control of the entire project.

### Recommended Git Workflow
```bash
# Clone the repository
git clone <repository-url>

# Work on backend
cd backend
composer install
php artisan migrate

# Work on frontend
cd ../frontend
npm install
npm run dev

# Commit changes
git add .
git commit -m "Your commit message"
git push
```

---

## 📝 Notes

1. **Environment Variables**: Backend `.env` is in `backend/` directory
2. **Dependencies**:
   - PHP/Laravel dependencies in `backend/vendor/`
   - NPM dependencies in `frontend/node_modules/`
3. **Database**: SQLite database located at `backend/database/database.sqlite`
4. **Public Assets**: Frontend assets served from `frontend/public/`
5. **Logs**: Application logs in `backend/storage/logs/`

---

## ✨ Project Status

- ✅ Backend and Frontend clearly separated
- ✅ No files lost or duplicated
- ✅ All dependencies intact
- ✅ Structure ready for team development
- ✅ Scalable folder organization

**Last Updated**: 2026-09-01
