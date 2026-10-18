# Full application hosting

The full Laravel application serves the original frontend and database API from one domain, including product/category editing and image uploads. The existing GitHub Pages site remains a read-only preview until a backend host is connected and deployment is verified.

## Railway setup

1. Create a service from `Keichiis/Putahe`, branch `main`. Keep the service root at the repository root, since the Dockerfile includes both `backend/` and `frontend/public/`.
2. Attach a persistent volume at `/data`. This stores SQLite records and uploaded images across deployments. Use one replica with this SQLite configuration.
3. Generate an application key from the local `backend` directory using `php artisan key:generate --show`. Store the value in Railway as `APP_KEY`. Keep it stable across deployments; do not commit it.
4. Generate a public domain and set the service's `APP_URL` to the complete HTTPS URL. Redeploy after setting it.
5. Deploy. The container installs production PHP dependencies, prepares writable storage, runs migrations, links uploaded images, and serves the frontend/API using Apache. The healthcheck is `/up`.

Production defaults are included in the Dockerfile: `APP_ENV=production`, `APP_DEBUG=false`, SQLite at `/data/database.sqlite`, storage at `/data/storage`, file-backed sessions/cache, and stderr logging. The platform must supply `APP_KEY` and the `/data` volume.

The initial hosted database is empty. Local database contents are not uploaded automatically, and the sample preview menu is not inserted into the live database.

## Verify and switch the public link

Verify the home page, `/api/products`, and `/api/categories`. Create a category/product, upload an image, edit the record, and reload the page. Redeploy and verify the record and image persist. Then remove the temporary test data.

Once the full application works, update the repository's Website field and README to its public URL. The GitHub Pages entry page can redirect to this URL so the existing `github.io` link opens the full app. Do this only after the backend is deployed and verified.

The existing API permits public product/category editing. Visitors to the hosted application will share one catalog and can modify it, matching the local application's behavior.

Railway may require a hosting plan. Confirm the account's current plan and charges before enabling paid resources.

References: [Railway Laravel deployment](https://docs.railway.com/guides/laravel), [persistent volumes](https://docs.railway.com/volumes), [configuration as code](https://docs.railway.com/config-as-code/reference).
