const apiOrigin = window.PUTAHE_API_URL || '';
const api = `${apiOrigin.replace(/\/$/, '')}/api/products`;
const categoryApi = `${apiOrigin.replace(/\/$/, '')}/api/categories`;
const rows = document.querySelector('#rows');
const dialog = document.querySelector('#dialog');
const form = document.querySelector('#form');
const confirmDialog = document.querySelector('#confirmDialog');
const confirmMessage = document.querySelector('#confirmMessage');
const addButton = document.querySelector('#add');
const cancelButton = document.querySelector('#cancel');
const closeButton = document.querySelector('.close');
const searchInput = document.querySelector('#search');
const imageFileInput = document.querySelector('#imageFile');
const toast = document.querySelector('#toast');
const total = document.querySelector('#total');
const available = document.querySelector('#available');
const low = document.querySelector('#low');
const idInput = document.querySelector('#id');
const title = document.querySelector('#title');
const categorySelect = document.querySelector('#category');
const manageCategoriesButton = document.querySelector('#manageCategories');
const categoryDialog = document.querySelector('#categoryDialog');
const categoryForm = document.querySelector('#categoryForm');
const categoryIdInput = document.querySelector('#categoryId');
const categoryNameInput = document.querySelector('#categoryName');
const categoryRows = document.querySelector('#categoryRows');
const closeCategoriesButton = document.querySelector('#closeCategories');

let products = [];
let categories = [];
const LOW_STOCK_THRESHOLD = 10;

const normalizeProduct = product => ({
    ...product,
    id: Number.isFinite(Number(product.id)) ? Number(product.id) : 0,
    name: String(product.name ?? ''),
    category: String(product.category ?? ''),
    status: String(product.status ?? 'Available'),
    stock: Number.isFinite(Number(product.stock)) ? Number(product.stock) : 0,
    price: Number.isFinite(Number(product.price)) ? Number(product.price) : 0,
    description: String(product.description ?? ''),
    image: String(product.image ?? ''),
});

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
}[character]));

const pesos = value => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
}).format(value);

const images = {
    pork: '/assets/lechon-kawali.webp',
    seafood: '/assets/buttered-shrimp.webp',
    soup: '/assets/bulalo.webp',
    vegetable: '/assets/chopsuey.webp',
    chicken: '/assets/chicken-adobo.webp',
};

const imageFor = product => product.image
    || images[Object.keys(images).find(key => product.category.toLowerCase().includes(key))]
    || '/assets/pork-adobo.webp';

function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2400);
}

function renderCategoryOptions(selected = '') {
    const names = [...new Set([...categories.map(category => category.name), selected].filter(Boolean))];
    categorySelect.innerHTML = `<option value="" disabled ${selected ? '' : 'selected'}>Select a category</option>${names
        .map(name => `<option value="${escapeHtml(name)}" ${name === selected ? 'selected' : ''}>${escapeHtml(name)}</option>`)
        .join('')}`;
}

function renderCategories() {
    categoryRows.innerHTML = categories.length ? categories.map(category => `
        <div class="category-row">
            <span>${escapeHtml(category.name)}</span>
            <div class="actions">
                <button class="secondary" type="button" onclick="editCategory(${category.id})">Edit</button>
                <button class="secondary delete" type="button" onclick="deleteCategory(${category.id})">Delete</button>
            </div>
        </div>
    `).join('') : '<p class="empty">No categories yet. Create one to start adding products.</p>';
}

function render(list = products) {
    total.textContent = products.length;
    available.textContent = products.filter(product => product.status === 'Available').length;
    low.textContent = products.filter(product => product.stock < LOW_STOCK_THRESHOLD).length;

    rows.innerHTML = list.length ? list.map(product => `
        <article class="product-card">
            <img class="product-image" src="${escapeHtml(imageFor(product))}" alt="${escapeHtml(product.name)}" onerror="this.onerror=null;this.src='/assets/pork-adobo.webp';">
            <div class="product-details">
                <div class="product-heading">
                    <div>
                        <div class="name">${escapeHtml(product.name)}</div>
                        <div class="category">${escapeHtml(product.category)}</div>
                    </div>
                    <div class="price">${pesos(product.price)}</div>
                </div>
                <p class="sub">${escapeHtml(product.description || 'Freshly prepared Putahe favorite')}</p>
                <div class="product-footer">
                    <span class="stock">${product.stock} in stock</span>
                    <span class="badge ${product.status.toLowerCase().replaceAll(' ', '-')}" aria-label="Status: ${escapeHtml(product.status)}">${escapeHtml(product.status)}</span>
                    <div class="actions">
                        <button class="secondary" type="button" onclick="editProduct(${product.id})">Edit</button>
                        <button class="secondary delete" type="button" onclick="deleteProduct(${product.id})">Delete</button>
                    </div>
                </div>
            </div>
        </article>
    `).join('') : '<div class="empty">No products match your search.</div>';
}

async function loadProducts() {
    try {
        const response = await fetch(api);
        if (!response.ok) throw new Error('Unable to load products');
        const payload = await response.json();
        if (!Array.isArray(payload)) throw new Error('Invalid product response');
        products = payload.map(normalizeProduct);
        render();
    } catch {
        rows.innerHTML = '<div class="empty">Could not load the menu. Please check your database connection.</div>';
    }
}

async function loadCategories() {
    try {
        const response = await fetch(categoryApi);
        if (!response.ok) throw new Error('Unable to load categories');
        const payload = await response.json();
        if (!Array.isArray(payload)) throw new Error('Invalid category response');
        categories = payload;
        renderCategoryOptions(categorySelect.value);
        renderCategories();
    } catch {
        notify('Unable to load categories.');
    }
}

function requestConfirmation(message) {
    confirmMessage.textContent = message;
    confirmDialog.showModal();

    return new Promise(resolve => {
        confirmDialog.addEventListener('close', () => resolve(confirmDialog.returnValue === 'confirm'), { once: true });
    });
}

window.editProduct = productId => {
    const product = products.find(item => item.id === Number(productId));
    if (!product) return;

    form.reset();
    title.textContent = 'Edit product';
    renderCategoryOptions(product.category);
    for (const key of ['id', 'name', 'category', 'status', 'price', 'stock', 'description']) {
        document.querySelector(`#${key}`).value = product[key] ?? '';
    }
    dialog.showModal();
};

window.deleteProduct = async productId => {
    const product = products.find(item => item.id === Number(productId));
    if (!product) return;

    if (!await requestConfirmation(`Delete "${product.name}"? This product will be permanently removed from your catalog.`)) return;

    try {
        const response = await fetch(`${api}/${productId}`, {
            method: 'DELETE',
            headers: { Accept: 'application/json' },
        });

        if (!response.ok) throw new Error('Unable to delete this product.');
        products = products.filter(item => item.id !== Number(productId));
        render();
        notify('Product deleted.');
    } catch {
        notify('Unable to delete this product.');
    }
};

addButton.onclick = () => {
    form.reset();
    idInput.value = '';
    title.textContent = 'Add product';
    renderCategoryOptions();
    dialog.showModal();
};

cancelButton.onclick = () => dialog.close();
closeButton.onclick = () => dialog.close();
closeCategoriesButton.onclick = () => categoryDialog.close();
manageCategoriesButton.onclick = () => {
    categoryForm.reset();
    categoryIdInput.value = '';
    categoryDialog.showModal();
};

window.editCategory = categoryId => {
    const category = categories.find(item => item.id === Number(categoryId));
    if (!category) return;

    categoryIdInput.value = category.id;
    categoryNameInput.value = category.name;
    categoryNameInput.focus();
};

window.deleteCategory = async categoryId => {
    const category = categories.find(item => item.id === Number(categoryId));
    if (!category || !await requestConfirmation(`Delete "${category.name}"?`)) return;

    try {
        const response = await fetch(`${categoryApi}/${categoryId}`, { method: 'DELETE', headers: { Accept: 'application/json' } });
        if (!response.ok) {
            const payload = await response.json();
            throw new Error(payload.message || 'Unable to delete this category.');
        }
        await loadCategories();
        notify('Category deleted.');
    } catch (error) {
        notify(error.message || 'Unable to delete this category.');
    }
};

categoryForm.onsubmit = async event => {
    event.preventDefault();
    const categoryId = categoryIdInput.value;

    try {
        const response = await fetch(categoryId ? `${categoryApi}/${categoryId}` : categoryApi, {
            method: categoryId ? 'PUT' : 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: categoryNameInput.value }),
        });
        if (!response.ok) throw new Error('Unable to save this category.');
        categoryForm.reset();
        categoryIdInput.value = '';
        await Promise.all([loadCategories(), loadProducts()]);
        notify(categoryId ? 'Category updated.' : 'Category created.');
    } catch {
        notify('A unique category name is required.');
    }
};

searchInput.oninput = () => {
    const query = searchInput.value.toLowerCase();
    render(products.filter(product => [product.name, product.category, product.status]
        .some(value => value.toLowerCase().includes(query))));
};

form.onsubmit = async event => {
    event.preventDefault();

    const productId = idInput.value;
    const data = new FormData();
    for (const key of ['name', 'category', 'status', 'price', 'stock', 'description']) {
        data.append(key, document.querySelector(`#${key}`).value);
    }
    if (productId) data.append('_method', 'PUT');
    if (imageFileInput.files[0]) data.append('image_file', imageFileInput.files[0]);

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        const response = await fetch(productId ? `${api}/${productId}` : api, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: data,
        });

        if (!response.ok) throw new Error('Unable to save this product.');
        const product = normalizeProduct(await response.json());
        products = productId
            ? products.map(item => item.id === product.id ? product : item)
            : [product, ...products];
        render();
        dialog.close();
        notify(productId ? 'Product updated.' : 'Product added.');
    } catch {
        notify('Please check the product details and try again.');
    } finally {
        submitButton.disabled = false;
    }
};

Promise.all([loadCategories(), loadProducts()]);
