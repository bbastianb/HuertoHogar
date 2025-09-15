// === Datos de productos (ajusta rutas de img si difieren) ===
const productos = [
  { id:"FR001", nombre:"Manzana Fuji", precio:1200, unidad:"x kilo", stock:"150 kilos", img:"img/manzanas.jpg", desc:"Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule." },
  { id:"FR003", nombre:"Naranjas Valencia", precio:1000, unidad:"x kilo", stock:"200 kilos", img:"img/naranja.jpg", desc:"Jugosas y ricas en vitamina C, ideales para zumos frescos." },
  { id:"FR002", nombre:"Platano", precio:800, unidad:"x kilo", stock:"250 kilos", img:"img/platanos.jpg", desc:"Plátanos maduros y dulces, perfectos para el desayuno." },
  { id:"FR004", nombre:"Frutillas", precio:3990, unidad:"x 500gr", stock:"100 kilos", img:"img/frutillas.jpg", desc:"Bayas jugosas y vibrantes para postres y batidos." },
  { id:"FR005", nombre:"Kiwi", precio:2990, unidad:"x kilo", stock:"250 kilos", img:"img/kiwi.jpg", desc:"Dulce y ácido, ideal para ensaladas, postres y snacks." },
  { id:"VR001", nombre:"Zanahorias Orgánicas", precio:900, unidad:"x kilo", stock:"100 kilos", img:"img/zanahoria.jpg", desc:"Crujientes y sin pesticidas, excelentes para ensaladas o jugos." },
  { id:"VR002", nombre:"Espinacas Frescas", precio:700, unidad:"x bolsa de 500gr", stock:"80 bolsas", img:"img/espinaca.jpg", desc:"Frescas y nutritivas, perfectas para ensaladas y batidos." },
  { id:"VR003", nombre:"Pimientos Tricolor", precio:1500, unidad:"x kilo", stock:"120 kilos", img:"img/pimenton.jpg", desc:"Rojos, amarillos y verdes, ricos en vitaminas A y C." },
  { id:"VR004", nombre:"Limón", precio:1490, unidad:"x kilo", stock:"200 kilos", img:"img/limon.jpg", desc:"Jugoso y de acidez equilibrada, ideal para múltiples recetas." },
  { id:"VR005", nombre:"Cebolla Blanca", precio:1600, unidad:"x kilo", stock:"150 kilos", img:"img/cebolla.jpg", desc:"Versátil, perfecta para sofritos y ensaladas." },
  { id:"PO001", nombre:"Miel Orgánica", precio:5000, unidad:"x frasco de 500gr", stock:"50 frascos", img:"img/miel.jpg", desc:"Pura y local, rica en antioxidantes." }
];

// === Render de productos con tu mismo HTML de tarjeta ===
const productsList = document.querySelector('.container-items');
// --- Helper para saber la categoría de cada producto ---
function getCategoria(p) {
  // 1) Si ya traes p.categoria, úsala
  if (p.categoria) {
    const c = p.categoria.trim().toLowerCase();
    if (c.startsWith('frut')) return 'frutas';
    if (c.startsWith('verdu')) return 'verduras';
    return 'otros';
  }
  // 2) Si no, deduce por prefijo del ID (FR = Frutas, VR = Verduras)
  const pref = String(p.id || '').slice(0, 2).toUpperCase();
  if (pref === 'FR') return 'frutas';
  if (pref === 'VR') return 'verduras';
  return 'otros';
}

// --- Estado del filtro ---
let categoriaActiva = 'todos';

// --- Render inicial (si ya llamabas a renderProductos(productos), puedes dejarlo) ---
if (typeof renderProductos === 'function') {
  renderProductos(productos);
}

// --- Clicks en la barra de filtros ---
const barraFiltros = document.querySelector('[data-filtros]');
if (barraFiltros) {
  barraFiltros.addEventListener('click', (e) => {
    const btn = e.target.closest('.filtro');
    if (!btn) return;

    categoriaActiva = btn.dataset.cat;              // 'todos' | 'frutas' | 'verduras' | 'otros'
    // Visual activo
    barraFiltros.querySelectorAll('.filtro').forEach(b => b.classList.toggle('active', b === btn));

    aplicarFiltro();
  });
}

// --- Aplica el filtro y vuelve a pintar ---
function aplicarFiltro() {
  if (categoriaActiva === 'todos') {
    renderProductos(productos);
  } else {
    const filtrados = productos.filter(p => getCategoria(p) === categoriaActiva);
    renderProductos(filtrados);
  }
}

// Si quieres que al cargar comience mostrando "Todos"
aplicarFiltro();
/* function renderProductos(lista) {
  if (!productsList) return;
  productsList.innerHTML = '';

  const frag = document.createDocumentFragment();

  lista.forEach(p => {
    const card = document.createElement('div');
    card.className = 'item';
    card.innerHTML = `
      <figure>
        <img src="${p.img}" alt="${p.nombre}">
      </figure>
      <div class="info-producto" onclick="window.location.href='detalle-producto.html';">
        <h2>${p.nombre}</h2>
        <p class="precio" data-precio="${p.precio}">$${p.precio} ${p.unidad ?? ''}</p>
        <p class="stock">${p.stock ?? ''}</p>
        <p class="desc">${p.desc ?? ''}</p>
        <button class="btn-add-cart">Añadir al carrito</button>
      </div>
    `;
    frag.appendChild(card);
  });

  productsList.appendChild(frag);
} */
function renderProductos(lista) {
  if (!productsList) return;
  productsList.innerHTML = '';

  const frag = document.createDocumentFragment();

  lista.forEach(p => {
    const card = document.createElement('div');
    card.className = 'item';
    card.innerHTML = `
      <a class="link-detalle" href="detalle-producto.html?id=${encodeURIComponent(p.id)}" aria-label="Ver ${p.nombre}">
        <figure>
          <img src="${p.img}" alt="${p.nombre}">
        </figure>
      </a>
      <div class="info-producto">
        <h2><a href="detalle-producto.html?id=${encodeURIComponent(p.id)}">${p.nombre}</a></h2>
        <p class="precio" data-precio="${p.precio}">$${p.precio} ${p.unidad ?? ''}</p>
        ${p.stock ? `<p class="stock">${p.stock}</p>` : ''}
       
        <button class="btn-add-cart">Añadir al carrito</button>
      </div>
    `;
    frag.appendChild(card);
  });

  productsList.appendChild(frag);
}
renderProductos(productos);

// === Variables del carrito (clases alineadas con tu CSS) ===
const btnCart = document.querySelector('.container-cart-icon');
const containerCartProduct = document.querySelector('.container-cart-producto'); // <- coincide con tu CSS
const rowProduct = document.querySelector('.row-product');
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

// === Estado del carrito ===
let allProducts = JSON.parse(localStorage.getItem('carrito')) || [];

// === Mostrar/Ocultar carrito ===
btnCart.addEventListener('click', () => {
  containerCartProduct.classList.toggle('hidden-cart');
});

// === Agregar productos ===
/* productsList.addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn-add-cart')) return;

  const productCard = e.target.closest('.item');
  const nombre = productCard.querySelector('h2').textContent.trim();
  // Tomamos el precio numérico real desde data-precio (tu precio visual puede tener "x kilo")
  const precio = parseInt(productCard.querySelector('.precio').dataset.precio, 10);

  const infoProduct = { quantity: 1, title: nombre, price: precio };

  const exists = allProducts.some(p => p.title === infoProduct.title);
  if (exists) {
    allProducts = allProducts.map(p => {
      if (p.title === infoProduct.title) p.quantity++;
      return p;
    });
  } else {
    allProducts = [...allProducts, infoProduct];
  }

  updateCart();
}); */
if (productsList) {
  productsList.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn-add-cart')) return;

    const productCard = e.target.closest('.item');
    const nombre = productCard.querySelector('h2').textContent.trim();
    const precio = parseInt(productCard.querySelector('.precio').dataset.precio, 10);

    const infoProduct = { quantity: 1, title: nombre, price: precio };

    const exists = allProducts.some(p => p.title === infoProduct.title);
    allProducts = exists
      ? allProducts.map(p => p.title === infoProduct.title ? { ...p, quantity: p.quantity + 1 } : p)
      : [...allProducts, infoProduct];

    updateCart();
  });
}
// === Eliminar productos ===
rowProduct.addEventListener('click', (e) => {
  if (!e.target.classList.contains('icon-close')) return;

  const product = e.target.closest('.cart-producto');
  const title = product.querySelector('.titulo-producto-carrito')?.textContent?.trim();

  allProducts = allProducts.filter(p => p.title !== title);
  updateCart();
});

// === Refrescar HTML + guardar en localStorage ===
const updateCart = () => {
  localStorage.setItem('carrito', JSON.stringify(allProducts));

  // Estados vacio / visible
  if (!allProducts.length) {
    cartEmpty.classList.remove('hidden');
    rowProduct.classList.add('hidden');
    cartTotal.classList.add('hidden');
  } else {
    cartEmpty.classList.add('hidden');
    rowProduct.classList.remove('hidden');
    cartTotal.classList.remove('hidden');
  }

  // muestra productos del carrito
  rowProduct.innerHTML = '';
  let total = 0;
  let totalProducts = 0;

  allProducts.forEach(p => {
    const containerProduct = document.createElement('div');
    containerProduct.className = 'cart-producto';
    containerProduct.innerHTML = `
      <div class="info-cart-product">
        <span class="cantidad-producto-carrito">${p.quantity}</span>
        <p class="titulo-producto-carrito">${p.title}</p>
        <span class="precio-producto-carrito">$${p.price}</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" 
        fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        stroke="currentColor" class="icon-close">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
      </svg>
    `;
    rowProduct.appendChild(containerProduct);

    total += p.quantity * p.price;
    totalProducts += p.quantity;
  });

  valorTotal.textContent = `$${total}`;
  countProducts.textContent = totalProducts;
};

// === Inicializar al cargar la página ===
updateCart();
// Comparte el catálogo con otras páginas

window.PRODUCTOS = productos;
