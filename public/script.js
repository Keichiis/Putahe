const apiOrigin = window.PUTAHE_API_URL || '';
const api = `${apiOrigin.replace(/\/$/, '')}/api/products`;
const rows = document.querySelector('#rows');
const dialog = document.querySelector('#dialog');
const form = document.querySelector('#form');
const photoPicker = document.querySelector('#photoPicker');
const confirmDialog = document.querySelector('#confirmDialog');
const confirmMessage = document.querySelector('#confirmMessage');
const addButton = document.querySelector('#add');
const cancelButton = document.querySelector('#cancel');
const closeButton = document.querySelector('.close');
const searchInput = document.querySelector('#search');
const imageInput = document.querySelector('#image');
const toast = document.querySelector('#toast');
const count = document.querySelector('#count');
const total = document.querySelector('#total');
const available = document.querySelector('#available');
const low = document.querySelector('#low');
const idInput = document.querySelector('#id');
const title = document.querySelector('#title');

let products = [];

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

const assets = [
    'bulalo.webp', 'buttered-shrimp.webp', 'calamares.webp', 'chicken-adobo.webp',
    'chicken-curry.webp', 'chicken-dish.webp', 'chicken.webp', 'chopsuey.webp',
    'fried-chicken.webp', 'ginisang-alimango.webp', 'ginisang-gulay.webp',
    'hero-bilao.webp', 'hero-cloth.webp', 'lechon-kawali.webp', 'logo-light.webp',
    'logo.png', 'pinakbet.webp', 'pork-adobo.webp', 'pork-dish.webp',
    'seafood-dish.webp', 'sinigang.webp', 'sisig.webp', 'soup-dish.webp',
    'story-restaurant.webp', 'tinola.webp', 'vegetable-dish.webp',
];

const imageFor = product => product.image
    || images[Object.keys(images).find(key => product.category.toLowerCase().includes(key))]
    || '/assets/pork-adobo.webp';

function renderPicker() {
    const selected = imageInput.value;

    photoPicker.innerHTML = assets.map(asset => `
        <button class="photo-option ${selected === `/assets/${asset}` ? 'selected' : ''}"
                type="button" data-image="/assets/${asset}" title="${asset.replace('.webp', '').replaceAll('-', ' ')}">
            <img src="/assets/${asset}" alt="">
        </button>
    `).join('');

    photoPicker.querySelectorAll('.photo-option').forEach(button => {
        button.onclick = () => {
            imageInput.value = button.dataset.image;
            renderPicker();
        };
    });
}

function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2400);
}

function render(list = products) {
    count.textContent = `${list.length} product${list.length === 1 ? '' : 's'} shown`;
    total.textContent = products.length;
    available.textContent = products.filter(product => product.status === 'Available').length;
    low.textContent = products.filter(product => product.stock > 0 && product.stock < 10).length;

    rows.innerHTML = list.length ? list.map(product => `
        <tr>
            <td>
                <div class="product">
                    <img src="${escapeHtml(imageFor(product))}" alt="">
                    <div>
                        <div class="name">${escapeHtml(product.name)}</div>
                        <div class="sub">${escapeHtml(product.description || 'Freshly prepared Putahe favorite')}</div>
                    </div>
                </div>
            </td>
            <td>${escapeHtml(product.category)}</td>
            <td class="price">${pesos(product.price)}</td>
            <td>${product.stock}</td>
            <td><span class="badge ${product.status.toLowerCase().replaceAll(' ', '-')}" aria-label="Status: ${escapeHtml(product.status)}">${escapeHtml(product.status)}</span></td>
            <td>
                <div class="actions">
                    <button class="secondary" type="button" onclick="editProduct(${product.id})">Edit</button>
                    <button class="secondary delete" type="button" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="6" class="empty">No products match your search.</td></tr>';
}

async function loadProducts() {
    try {
        const response = await fetch(api);
        if (!response.ok) throw new Error('Unable to load products');
        products = await response.json();
        render();
    } catch {
        rows.innerHTML = '<tr><td colspan="6" class="empty">Could not load the menu. Please check your database connection.</td></tr>';
    }
}

window.editProduct = productId => {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    form.reset();
    title.textContent = 'Edit product';
    for (const key of ['id', 'name', 'category', 'status', 'price', 'stock', 'image', 'description']) {
        document.querySelector(`#${key}`).value = product[key] ?? '';
    }
    renderPicker();
    dialog.showModal();
};

window.deleteProduct = async productId => {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    confirmMessage.textContent = `Delete "${product.name}"? This product will be permanently removed from your catalog.`;
    confirmDialog.showModal();

    const result = await new Promise(resolve => {
        confirmDialog.addEventListener('close', () => resolve(confirmDialog.returnValue), { once: true });
    });

    if (result !== 'confirm') return;

    const response = await fetch(`${api}/${productId}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
    });

    if (response.ok) {
        products = products.filter(item => item.id !== productId);
        render();
        notify('Product deleted.');
    } else {
        notify('Unable to delete this product.');
    }
};

addButton.onclick = () => {
    form.reset();
    idInput.value = '';
    title.textContent = 'Add product';
    renderPicker();
    dialog.showModal();
};

cancelButton.onclick = () => dialog.close();
closeButton.onclick = () => dialog.close();

searchInput.oninput = () => {
    const query = searchInput.value.toLowerCase();
    render(products.filter(product => [product.name, product.category, product.status]
        .some(value => value.toLowerCase().includes(query))));
};

form.onsubmit = async event => {
    event.preventDefault();

    const productId = idInput.value;
    const data = Object.fromEntries([
        'name', 'category', 'status', 'price', 'stock', 'image', 'description',
    ].map(key => [key, document.querySelector(`#${key}`).value]));

    const response = await fetch(productId ? `${api}/${productId}` : api, {
        method: productId ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        const product = await response.json();
        products = productId
            ? products.map(item => item.id === product.id ? product : item)
            : [product, ...products];
        render();
        dialog.close();
        notify(productId ? 'Product updated.' : 'Product added.');
    } else {
        notify('Please check the product details and try again.');
    }
};

renderPicker();
loadProducts();
