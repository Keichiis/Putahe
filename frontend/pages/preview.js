const sampleProducts = [
    { name: 'Chicken Adobo', category: 'Chicken Dishes', price: 180, stock: 18, image: 'chicken-adobo.webp', description: 'Tender chicken simmered in soy sauce, vinegar, garlic, and bay leaves.' },
    { name: 'Bulalo', category: 'Soup', price: 350, stock: 8, image: 'bulalo.webp', description: 'A comforting beef shank soup with corn and fresh vegetables.' },
    { name: 'Lechon Kawali', category: 'Pork Dishes', price: 250, stock: 12, image: 'lechon-kawali.webp', description: 'Crispy golden pork belly, freshly prepared for the table.' },
    { name: 'Buttered Shrimp', category: 'Seafood', price: 320, stock: 6, image: 'buttered-shrimp.webp', description: 'Juicy shrimp tossed in a rich garlic butter sauce.' },
    { name: 'Chopsuey', category: 'Vegetable Dishes', price: 160, stock: 15, image: 'chopsuey.webp', description: 'A colorful mix of crisp vegetables in a light savory sauce.' },
    { name: 'Pork Sisig', category: 'Pork Dishes', price: 220, stock: 0, image: 'sisig.webp', description: 'A sizzling Filipino favorite with citrus and savory seasoning.' },
];

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const pesos = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
const rows = document.querySelector('#rows');

document.querySelector('#total').textContent = sampleProducts.length;
document.querySelector('#available').textContent = sampleProducts.filter(product => product.stock > 0).length;
document.querySelector('#low').textContent = sampleProducts.filter(product => product.stock < 10).length;

for (const selector of ['#add', '#manageCategories']) {
    const button = document.querySelector(selector);
    button.disabled = true;
    button.title = 'Editing is available when you run the Laravel project locally.';
}

function render(query = '') {
    const products = sampleProducts.filter(product => [product.name, product.category, product.stock > 0 ? 'Available' : 'Out of Stock']
        .some(value => value.toLowerCase().includes(query.toLowerCase().trim())));

    rows.innerHTML = products.length ? products.map(product => {
        const status = product.stock > 0 ? 'Available' : 'Out of Stock';
        return `
            <article class="product-card">
                <img class="product-image" src="./assets/${product.image}" alt="${escapeHtml(product.name)}">
                <div class="product-details">
                    <div class="product-heading">
                        <div>
                            <div class="name">${escapeHtml(product.name)}</div>
                            <div class="category">${escapeHtml(product.category)}</div>
                        </div>
                        <div class="price">${pesos(product.price)}</div>
                    </div>
                    <p class="sub">${escapeHtml(product.description)}</p>
                    <div class="product-footer">
                        <span class="stock">${product.stock} in stock</span>
                        <span class="badge ${status.toLowerCase().replaceAll(' ', '-')}">${status}</span>
                    </div>
                </div>
            </article>`;
    }).join('') : '<div class="empty">No products match your search.</div>';
}

document.querySelector('#search').addEventListener('input', event => render(event.target.value));
render();
