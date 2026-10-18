<!doctype html>
<html lang="en">
    
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Commissioner:wght@100..900&family=Nanum+Gothic&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Putahe | Menu Management</title>
    <style>
        
        :root { --red:#b20103; --red-dark:#780001; --gold:#f5c242; --cream:#fffaf2; --ink:#261818; --muted:#776868; --line:#eaded7; }
        * { box-sizing:border-box; }
        body { margin:0; min-height:100vh; color:var(--ink); background:var(--cream); font:14px/2.5 Poppins,Arial,sans-serif; }
        .top { background:var(--red); color:#fff; border-bottom:4px solid var(--gold); }
        .top-inner, main { width:min(1200px,calc(100% - 40px)); margin:auto; }
        .top-inner { height:78px; display:flex; align-items:center; gap:26px;  }
        .logo { display:flex; align-items:center; text-decoration:none; }.logo img { width:104px; height:auto; max-height:54px; object-fit:contain; }
        .crumb { border-left:1px solid #ffffff5e; padding-left:26px; font-weight:600; color:#ffe7c8; }
        main { padding:42px 0 60px; }
        .hero { background:linear-gradient(120deg,#8f0002,#b20103 62%,#c82716); color:#fff; border-radius:18px; overflow:hidden; min-height:184px; padding:31px 38px; position:relative; display:flex; align-items:center; justify-content:space-between; gap:24px; box-shadow:0 12px 28px #8a181829; }
        .hero:after { content:""; position:absolute; width:240px; height:240px; border:25px solid #f5c24238; border-radius:50%; right:-56px; top:-65px; }
        .hero-copy { position:relative; z-index:1; }.eyebrow { font-size:11px; font-weight:800; color:var(--gold); letter-spacing:.14em; text-transform:uppercase; }.hero h1 { font:800 clamp(26px,4vw,38px)/1.1 Georgia,serif; margin:6px 0 8px; }.hero p { margin:0; max-width:550px; color:#ffe7d1; }.hero-plates { position:relative; z-index:1; display:flex; }.hero-plates img { width:88px; height:88px; object-fit:cover; border:4px solid #fff6; border-radius:50%; margin-left:-18px; box-shadow:0 5px 10px #52000044; }.hero-plates img:first-child { margin-left:0; }
        .primary { border:0; background:var(--gold); color:#4a2100; border-radius:7px; padding:11px 16px; cursor:pointer; font-weight:800; font:inherit; box-shadow:0 3px 7px #25000036; }.primary:hover { background:#ffda68; }
        .action-add { position:absolute; right:38px; bottom:27px; z-index:2; }
        .summary { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin:24px 0; }.metric { background:#fff; border:1px solid var(--line); border-radius:12px; padding:17px 20px; border-top:4px solid var(--gold); }.metric small { color:var(--muted); font-weight:600; }.metric strong { display:block; color:var(--red); font:800 27px/1.2 Georgia,serif; margin-top:3px; }
        .panel { background:#fff; border:1px solid var(--line); border-radius:13px; overflow:hidden; box-shadow:0 7px 20px #5120160b; }.toolbar { padding:17px 20px; display:flex; align-items:center; justify-content:space-between; gap:16px; border-bottom:1px solid var(--line); }.search { width:min(390px,100%); padding:10px 13px; border:1px solid #d7c5be; border-radius:7px; font:inherit; outline:0; }.search:focus { border-color:var(--red); box-shadow:0 0 0 3px #b2010314; }.count { color:var(--muted); font-size:13px; }
        table { width:100%; border-collapse:collapse; } th { background:#fff8ee; color:#8b6660; text-align:left; text-transform:uppercase; font-size:11px; letter-spacing:.07em; } th,td { padding:14px 18px; border-bottom:1px solid #f0e6e1; } td { vertical-align:middle; }.product { display:flex; gap:12px; align-items:center; min-width:210px; }.product img,.fallback { width:48px; height:48px; border-radius:50%; object-fit:cover; background:#f7dfbb; }.fallback { display:grid; place-items:center; color:var(--red); font:bold 18px Georgia,serif; }.name,.price { font-weight:800; }.sub { color:var(--muted); font-size:12px; max-width:240px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }.price { color:var(--red); }.badge { display:inline-block; padding:4px 9px; border-radius:99px; font-size:12px; font-weight:800; }.active { background:#e6f5e8; color:#216f37; }.draft { background:#fff0ca; color:#8b5600; }.out-of-stock { background:#ffe0dc; color:#b52519; }.actions { display:flex; gap:8px; }.secondary { background:#fff; color:#653d36; border:1px solid #dccac2; padding:7px 10px; border-radius:6px; cursor:pointer; font:700 12px Poppins,Arial,sans-serif; }.secondary:hover { border-color:var(--red); color:var(--red); }.delete:hover { background:#fff1ef; }.empty { padding:46px; text-align:center; color:var(--muted); }
        dialog { width:min(580px,calc(100% - 28px)); border:0; padding:0; border-radius:13px; box-shadow:0 22px 60px #28110b66; }.modal-head { background:var(--red); color:#fff; padding:19px 24px; display:flex; justify-content:space-between; align-items:center; }.modal-head h2 { margin:0; font:800 21px Georgia,serif; }.close { background:none; border:0; color:#fff; cursor:pointer; font-size:25px; }.form { display:grid; grid-template-columns:1fr 1fr; gap:14px; padding:22px 24px 25px; }.field { display:grid; gap:5px; }.full,.form-actions { grid-column:1/-1; }.field label { color:#644941; font-weight:700; font-size:12px; }.field input,.field select,.field textarea { border:1px solid #d9c8c0; border-radius:7px; padding:10px; font:inherit; }.field textarea { min-height:70px; resize:vertical; }.photo-picker{display:grid;grid-template-columns:repeat(7,1fr);gap:7px}.photo-option{padding:0;border:2px solid transparent;background:none;border-radius:8px;overflow:hidden;aspect-ratio:1;cursor:pointer}.photo-option img{width:100%;height:100%;object-fit:cover;display:block}.photo-option:hover,.photo-option.selected{border-color:var(--gold);box-shadow:0 0 0 2px var(--red)}.form-actions { display:flex; justify-content:flex-end; gap:9px; margin-top:4px; }.toast { position:fixed; right:22px; bottom:22px; padding:12px 16px; border-radius:8px; color:#fff; background:var(--red-dark); box-shadow:0 5px 16px #0003; opacity:0; transform:translateY(10px); transition:.2s; }.toast.show { opacity:1; transform:none; }
        @media(max-width:720px) { .top-inner,main{width:min(100% - 28px,1200px)}.crumb{padding-left:16px}.hero{padding:28px 23px 79px}.hero-plates{display:none}.action-add{left:23px;right:auto}.summary{grid-template-columns:1fr}.toolbar{align-items:stretch;flex-direction:column}.table-wrap{overflow:auto}.form{grid-template-columns:1fr}.photo-picker{grid-template-columns:repeat(5,1fr)} }
        /* Higher contrast and larger type for easier reading */
        body { color:#1c1010; font-size:15px; }
        .crumb { color:#fff6e9; font-weight:700; }
        .hero p { color:#fff7eb; font-weight:600; }
        .metric small { color:#5f4640; font-weight:800; font-size:13px; }
        .metric strong { font-size:29px; }
        th { color:#65433b; font-size:12px; font-weight:800; }
        td { color:#2c1a17; font-weight:600; }
        .sub { color:#6d514a; font-size:13px; font-weight:500; }
        .badge { padding:5px 10px; font-weight:800; }
        .available,.active { background:#bcebc7; color:#14532d; }
        .out-of-stock { background:#ffd0c9; color:#991b1b; }
        .secondary { color:#4f2c25; border-color:#c7aaa0; font-size:13px; }
        .field label { color:#4f302a; font-size:13px; font-weight:800; }
        .field input,.field select,.field textarea { color:#241311; border-color:#c6aaa0; font-weight:500; }
    </style>
</head>
<body>
    <header class="top"><div class="top-inner"><a class="logo" href="/"><img src="/assets/logo.png" alt="Putahe"></a><div class="crumb">Product List Management</div></div></header>
    <main>
        <section class="hero"><div class="hero-copy"><div class="eyebrow">Putahe kitchen</div><h1>Manage your products</h1><p>Keep every lutong-bahay favorite accurate and ready for your customers.</p></div><div class="hero-plates"><img src="/assets/sisig.webp" alt="Sisig"><img src="/assets/buttered-shrimp.webp" alt="Buttered shrimp"><img src="/assets/bulalo.webp" alt="Bulalo"></div><button class="primary action-add" id="add">+ Add product</button></section>
        <section class="summary"><div class="metric"><small>Total products</small><strong id="total">0</strong></div><div class="metric"><small>Available products</small><strong id="active">0</strong></div><div class="metric"><small>Low stock products</small><strong id="low">0</strong></div></section>
        <section class="panel"><div class="toolbar"><input class="search" id="search" type="search" placeholder="Search products, categories, or status"><span class="count" id="count">Loading products…</span></div><div class="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock Quantity</th><th>Status</th><th>Actions</th></tr></thead><tbody id="rows"></tbody></table></div></section>
    </main>
    <dialog id="dialog"><div class="modal-head"><h2 id="title">Add product</h2><button class="close" type="button" aria-label="Close">×</button></div><form class="form" id="form"><input id="id" type="hidden"><div class="field full"><label for="name">Product name</label><input id="name" required></div><div class="field"><label for="category">Category</label><input id="category" required placeholder="e.g. Pork Dishes"></div><div class="field"><label for="status">Status</label><select id="status"><option>Available</option><option>Out of Stock</option></select></div><div class="field"><label for="price">Price (PHP)</label><input id="price" type="number" min="0" step=".01" required></div><div class="field"><label for="stock">Stock quantity</label><input id="stock" type="number" min="0" required></div><div class="field full"><label for="image">Image URL (optional)</label><input id="image" type="text" placeholder="Or choose a Putahe image below"></div><div class="field full"><label>Choose from Putahe assets</label><div class="photo-picker" id="photoPicker"></div></div><div class="field full"><label for="description">Description (optional)</label><textarea id="description"></textarea></div><div class="form-actions"><button class="secondary" type="button" id="cancel">Cancel</button><button class="primary" type="submit">Save product</button></div></form></dialog>
    <div class="toast" id="toast" role="status"></div>
    <script>
        const api='/api/products', rows=document.querySelector('#rows'), dialog=document.querySelector('#dialog'), form=document.querySelector('#form'), photoPicker=document.querySelector('#photoPicker');
        let products=[];
        const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
        const pesos=value=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP'}).format(value);
        const foodImages={pork:'/assets/lechon-kawali.webp',seafood:'/assets/buttered-shrimp.webp',soup:'/assets/bulalo.webp',vegetable:'/assets/chopsuey.webp',chicken:'/assets/chicken-adobo.webp'};
        const photoAssets=['bulalo.webp','buttered-shrimp.webp','calamares.webp','chicken-adobo.webp','chicken-curry.webp','chicken-dish.webp','chicken.webp','chopsuey.webp','fried-chicken.webp','ginisang-alimango.webp','ginisang-gulay.webp','hero-bilao.webp','hero-cloth.webp','lechon-kawali.webp','logo-light.webp','logo.png','pinakbet.webp','pork-adobo.webp','pork-dish.webp','seafood-dish.webp','sinigang.webp','sisig.webp','soup-dish.webp','story-restaurant.webp','tinola.webp','vegetable-dish.webp'];
        const dishImage=product=>product.image||foodImages[Object.keys(foodImages).find(key=>product.category.toLowerCase().includes(key))]||'/assets/pork-adobo.webp';
        function renderPhotoPicker() {
            const selected=document.querySelector('#image').value;
            photoPicker.innerHTML=photoAssets.map(asset=>`<button class="photo-option ${selected==='/assets/'+asset?'selected':''}" type="button" data-asset="/assets/${asset}" title="${asset.replace('.webp','').replaceAll('-',' ')}"><img src="/assets/${asset}" alt=""></button>`).join('');
            photoPicker.querySelectorAll('.photo-option').forEach(button=>button.onclick=()=>{ document.querySelector('#image').value=button.dataset.asset; renderPhotoPicker(); });
        }
        function notify(message) { toast.textContent=message; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2400); }
        function render(list=products) {
            count.textContent=`${list.length} product${list.length===1?'':'s'} shown`;
            total.textContent=products.length; active.textContent=products.filter(product=>product.status==='Available').length; low.textContent=products.filter(product=>product.stock>0&&product.stock<10).length;
            rows.innerHTML=list.length?list.map(product=>`<tr><td><div class="product"><img src="${escapeHtml(dishImage(product))}" alt=""><div><div class="name">${escapeHtml(product.name)}</div><div class="sub">${escapeHtml(product.description||'Freshly prepared Putahe favorite')}</div></div></div></td><td>${escapeHtml(product.category)}</td><td class="price">${pesos(product.price)}</td><td>${product.stock}</td><td><span class="badge ${product.status.toLowerCase().replaceAll(' ','-')}">${escapeHtml(product.status)}</span></td><td><div class="actions"><button class="secondary" onclick="editDish(${product.id})">Edit</button><button class="secondary delete" onclick="deleteDish(${product.id})">Delete</button></div></td></tr>`).join(''):'<tr><td colspan="6" class="empty">No products match your search.</td></tr>';
        }
        async function loadProducts() { try { const response=await fetch(api); if(!response.ok) throw Error(); products=await response.json(); render(); } catch { rows.innerHTML='<tr><td colspan="6" class="empty">Could not load the menu. Please check your database connection.</td></tr>'; } }
        window.editDish=id=>{ const product=products.find(item=>item.id===id); form.reset(); title.textContent='Edit product'; for(const key of ['id','name','category','status','price','stock','image','description']) document.querySelector(`#${key}`).value=product[key]??''; renderPhotoPicker(); dialog.showModal(); };
        window.deleteDish=async id=>{ const product=products.find(item=>item.id===id); if(!confirm(`Delete ${product.name}? This cannot be undone.`)) return; const response=await fetch(`${api}/${id}`,{method:'DELETE',headers:{Accept:'application/json'}}); if(response.ok) { products=products.filter(item=>item.id!==id); render(); notify('Product deleted.'); } else notify('Unable to delete this product.'); };
        add.onclick=()=>{ form.reset(); document.querySelector('#id').value=''; title.textContent='Add product'; renderPhotoPicker(); dialog.showModal(); };
        cancel.onclick=document.querySelector('.close').onclick=()=>dialog.close();
        search.oninput=()=>{ const query=search.value.toLowerCase(); render(products.filter(product=>[product.name,product.category,product.status].some(value=>value.toLowerCase().includes(query)))); };
        form.onsubmit=async event=>{ event.preventDefault(); const id=document.querySelector('#id').value; const data=Object.fromEntries(['name','category','status','price','stock','image','description'].map(key=>[key,document.querySelector(`#${key}`).value])); const response=await fetch(id?`${api}/${id}`:api,{method:id?'PUT':'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)}); if(response.ok) { const product=await response.json(); products=id?products.map(item=>item.id===product.id?product:item):[product,...products]; render(); dialog.close(); notify(id?'Product updated.':'Product added.'); } else notify('Please check the product details and try again.'); };
        renderPhotoPicker();
        loadProducts();
    </script>
    
</body>
</html>
