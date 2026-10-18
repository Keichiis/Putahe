import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

// Runs only against the temporary CI container and its isolated database.
const origin = 'http://127.0.0.1:8080';

async function ready() {
    for (let attempt = 0; attempt < 90; attempt++) {
        try {
            const response = await fetch(`${origin}/up`, { signal: AbortSignal.timeout(2000) });
            if (response.ok) return;
        } catch { /* The container may still be starting. */ }
        await delay(1000);
    }
    throw new Error('The production container did not become healthy.');
}

async function request(path, method = 'GET', body, status = 200) {
    const multipart = body instanceof FormData;
    const headers = { Accept: 'application/json' };
    if (body && !multipart) headers['Content-Type'] = 'application/json';
    const response = await fetch(origin + path, {
        method,
        headers,
        body: body ? (multipart ? body : JSON.stringify(body)) : undefined,
        signal: AbortSignal.timeout(10000),
    });
    const text = await response.text();
    assert.equal(response.status, status, `${method} ${path}: ${text}`);
    return text ? JSON.parse(text) : null;
}

await ready();
const home = await fetch(origin);
assert.equal(home.status, 200);
assert.match(await home.text(), /Manage your products/);
assert.equal((await fetch(`${origin}/style.css`)).status, 200);
assert.equal((await fetch(`${origin}/assets/logo.png`)).status, 200);
assert.deepEqual(await request('/api/products'), []);

const category = await request('/api/categories', 'POST', { name: 'Hosting check' }, 201);
const form = new FormData();
for (const [key, value] of Object.entries({
    name: 'Hosting check product', category: category.name, price: '100', stock: '3', status: 'Available',
})) form.append(key, value);
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aB1sAAAAASUVORK5CYII=', 'base64');
form.append('image_file', new Blob([png], { type: 'image/png' }), 'check.png');
const product = await request('/api/products', 'POST', form, 201);
assert.match(product.image, /^\/storage\/products\//);
assert.equal((await fetch(origin + product.image)).status, 200);

await request(`/api/products/${product.id}`, 'PUT', { price: 125 });
await request(`/api/categories/${category.id}`, 'PUT', { name: 'Renamed hosting check' });
await request(`/api/categories/${category.id}`, 'DELETE', undefined, 422);

execFileSync('docker', ['restart', 'putahe-ci'], { stdio: 'inherit' });
await ready();
const persisted = await request(`/api/products/${product.id}`);
assert.equal(Number(persisted.price), 125);
assert.equal(persisted.category, 'Renamed hosting check');
assert.equal((await fetch(origin + product.image)).status, 200);

await request(`/api/products/${product.id}`, 'DELETE', undefined, 204);
await request(`/api/categories/${category.id}`, 'DELETE', undefined, 204);
assert.deepEqual(await request('/api/products'), []);
console.log('Production container passed: frontend, API editing, uploads, and persistence after restart.');
