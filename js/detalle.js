// js/detalle.js
(function () {



  const $ = (sel, parent = document) => parent.querySelector(sel);

  // 1) Tomar el id desde la URL: detalle-producto.html?id=FR001
  const params = new URLSearchParams(location.search);
  const qid = params.get('id');

  // 2) Catálogo compartido (expuesto en index.js como window.PRODUCTOS)
  const catalogo = (typeof window.PRODUCTOS !== 'undefined' && window.PRODUCTOS) || [];
  if (!catalogo.length) return;

  const prod = catalogo.find(p => String(p.id) === String(qid)) || catalogo[0];

  // 3) Pintar detalle
  const img = $('#MainImg');
  const hNombre = $('#nombre');
  const hPrecio = $('#precio');
  const qty = $('#qty');
  const spanDesc = $('#descripcion');

  if (img) { img.src = prod.img; img.alt = prod.nombre; }
  if (hNombre) hNombre.textContent = prod.nombre;
  if (hPrecio) {
    hPrecio.textContent = `$${prod.precio} ${prod.unidad ?? ''}`;
    hPrecio.dataset.precio = prod.precio;
  }
  if (spanDesc) spanDesc.textContent = prod.desc || '';

  // 4) Añadir al carrito (usa las mismas estructuras que index.js)
  const btnAdd = $('.btn-add-cart2');
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      const n = Math.max(1, parseInt(qty?.value || '1', 10));
      if (typeof window.allProducts === 'undefined') return;

      const info = { quantity: n, title: prod.nombre, price: prod.precio };
      const exists = window.allProducts.some(p => p.title === info.title);
      window.allProducts = exists
        ? window.allProducts.map(p => p.title === info.title ? { ...p, quantity: p.quantity + n } : p)
        : [...window.allProducts, info];

      if (typeof window.updateCart === 'function') window.updateCart();

      btnAdd.textContent = '¡Añadido!';
      setTimeout(() => (btnAdd.textContent = 'Añadir al carrito'), 1200);
    });
  }

  // 5) Render “Relacionados” (misma “categoría” por prefijo de ID)
  const contRel = $('#relacionados');
  if (contRel) {
    const pref = String(prod.id).slice(0, 2); // FR, VR, PO...
    const etiqueta = pref === 'FR' ? 'Frutas' : pref === 'VR' ? 'Verduras' : 'Otros';

    const relacionados = catalogo
      .filter(p => p.id !== prod.id && String(p.id).startsWith(pref))
      .slice(0, 4);

    contRel.innerHTML = relacionados.map(p => `
      <div class="pro">
        <a href="detalle-producto.html?id=${encodeURIComponent(p.id)}" aria-label="Ver ${p.nombre}">
          <img src="${p.img}" alt="${p.nombre}">
        </a>
        <div class="des">
          <span>${etiqueta}</span>
          <h5>${p.nombre}</h5>
          <div class="star">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <h4>$${p.precio} ${p.unidad ?? ''}</h4>
          <div class="carr">
            <button class="btn-add-cart" data-id="${p.id}" data-qty="1" aria-label="Añadir ${p.nombre} al carrito">
            </button>
          </div>
        </div>
      </div>
    `).join('');

    contRel.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-add-cart');
      if (!btn) return;
      const rel = catalogo.find(x => String(x.id) === String(btn.dataset.id));
      if (!rel || typeof window.allProducts === 'undefined') return;

      const info = { quantity: 1, title: rel.nombre, price: rel.precio };
      const exists = window.allProducts.some(p => p.title === info.title);
      window.allProducts = exists
        ? window.allProducts.map(p => p.title === info.title ? { ...p, quantity: p.quantity + 1 } : p)
        : [...window.allProducts, info];

      if (typeof window.updateCart === 'function') window.updateCart();
    });
  }
})();
