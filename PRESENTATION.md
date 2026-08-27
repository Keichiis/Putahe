# Product List Management

## Midterm Presentation Guide

### 1. Overall design and layout

This module is a Product List Management System for managing food products.

The main page is built in `public/index.html` and styled in `public/style.css`. The layout contains:

- A sticky header with the Putahe logo and module title.
- A hero section with the page title, supporting text, and food imagery.
- Three summary metrics: total products, available products, and low-stock products.
- A product-list toolbar with a search field and Add product button.
- Image-led product cards. Each card shows the product image, name, category, description, price, stock quantity, status, and Edit/Delete actions.
- A modal form for adding or editing products.
- A confirmation dialog before deleting a product.
- Responsive CSS that changes the product cards and form layout for smaller screens.

The visual design uses a Putahe-inspired red, gold, cream, and white color palette. Large food images make the catalog feel like a menu while the product details and management controls remain easy to scan.

### 2. Development approach and methodology

We used a client-server architecture:

- Frontend: HTML, CSS, and JavaScript.
- Backend: Laravel 13 with PHP.
- Database: MySQL through Laravel migrations and Eloquent ORM.
- API: Laravel API resource routes in `routes/api.php`.
- File handling: Laravel public storage for uploaded product images.

The main development method was incremental CRUD development:

1. Define the product database structure with migrations.
2. Create the Product model and controller.
3. Expose product operations through REST-style API routes.
4. Build the frontend form and product list.
5. Connect the frontend to the API using `fetch()`.
6. Add validation, image uploads, confirmation dialogs, responsive styling, and testing.

The product controller validates names, categories, prices, stock, status values, descriptions, and uploaded image files before saving data. The controller accepts only the statuses `Available` and `Out of Stock`.

### 3. How the Search feature works

When the page loads, `public/script.js` sends a `GET` request to `/api/products`. Laravel's `ProductController@index` reads the products from MySQL and returns JSON. The JavaScript stores the returned products in the `products` array and renders them on the page.

When the user types in the search field, the `oninput` handler converts the query to lowercase and filters the already-loaded array. It checks the product name, category, and status:

```javascript
const query = searchInput.value.toLowerCase();
render(products.filter(product => [product.name, product.category, product.status]
    .some(value => value.toLowerCase().includes(query))));
```

This means the current visible search is client-side and updates without a new request to the server. The backend also supports an optional `search` query parameter in `ProductController@index`, but the current frontend does not use that parameter. For a very large catalog, server-side search and pagination would be a future improvement.

### 4. How Edit and Delete work

#### Edit

1. Each product card has an Edit button containing the product ID.
2. The `editProduct()` function finds that product in the local `products` array.
3. The product values are placed into the modal form.
4. The user changes the fields and may select an image from the device.
5. JavaScript creates a `FormData` object and adds the form values and optional `image_file`.
6. For an existing product, JavaScript adds `_method=PUT` and sends a `POST` request to `/api/products/{id}`. This method spoofing allows Laravel to process multipart file uploads reliably.
7. Laravel route model binding finds the product. The controller validates the request, stores a new image when supplied, updates the database record, and returns the updated product as JSON.
8. JavaScript replaces the changed product in the local array and re-renders the list.

#### Delete

1. The user selects Delete on a product card.
2. The application opens a confirmation dialog containing the product name.
3. Only after confirmation does JavaScript send a `DELETE` request to `/api/products/{id}`.
4. Laravel route model binding identifies the product, and `destroy()` deletes it.
5. After a successful response, JavaScript removes the product from the local array and re-renders the list.

### 5. Challenges and how they were resolved

#### Connecting the frontend to the database

The page initially displayed a generic database error. We tested the route list, migration status, database connection, and API directly. Laravel was able to connect to MySQL, the migrations had run, and `/api/products` returned JSON. The issue was serving the frontend from a context where the Laravel API was not available, such as opening static files directly or using a static deployment.

**Resolution:** Run the page through Laravel, for example with `php artisan serve`, and use the same origin for the frontend and `/api/products`.

#### Deployment and backend hosting

GitHub stores the source code but does not run Laravel or MySQL. A static Vercel output would serve the frontend without executing the Laravel API.

**Resolution:** Configure Vercel with the Laravel PHP entrypoint and configure production environment variables for a hosted MySQL database. The production database must be reachable from Vercel; a local Laragon database is not publicly available.

#### Temporary testing with users on other networks

A local server is normally accessible only from the developer's computer or local network.

**Resolution:** Use a temporary Cloudflare Tunnel that forwards a public HTTPS URL to the local Laravel server. This is useful for demonstrations, but the link depends on the computer, Laravel server, database, internet connection, and tunnel process remaining active.

#### Device image uploads

A browser cannot read arbitrary files from a user's device without permission. The user must choose a file through an `<input type="file">`. The frontend sends that file as multipart `FormData`, and Laravel validates and stores it in `storage/app/public/products`.

**Resolution:** Run `php artisan storage:link` locally so files are available through `/storage/...`. Permanent production uploads need object storage such as S3 or Cloudinary because serverless/local deployment storage may be temporary.

#### Keeping the interface usable on small screens

A wide data table is difficult to scan on a phone.

**Resolution:** Use image-led product cards and responsive CSS. On smaller screens, the image becomes full-width and product information stacks vertically.

### 6. Lessons learned

- A frontend page is not a complete application until it can communicate with a backend and database.
- API endpoints should be tested directly instead of relying only on what the browser displays.
- Migrations provide a repeatable way to create and update database structures.
- Validation protects the database from invalid prices, stock values, statuses, and files.
- CRUD operations require coordination between frontend requests, routes, controllers, models, and database records.
- `FormData` is needed when a request includes an uploaded file; the request should not manually set the multipart content type.
- Method spoofing is useful when combining file uploads with Laravel update routes.
- Client-side search is simple and responsive for a small catalog, but large catalogs need server-side filtering and pagination.
- Responsive design should be planned as part of the layout, not added only after the desktop interface is finished.
- Local storage and temporary tunnels are useful for development and demonstrations, but production systems need hosted databases and durable file storage.
- Focused tests and direct HTTP checks make debugging faster and more reliable.

## Short closing statement

This project demonstrates how a responsive frontend, Laravel API, MySQL database, validation, CRUD operations, and file uploads work together in one product management module. The main future improvements would be authentication, server-side search with pagination, and permanent cloud image storage for production.
