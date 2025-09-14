(function(){
  if (typeof L === 'undefined') {
    console.error('Leaflet no cargó. Verifica la conexión o el tag de Leaflet.');
    return;
  }
  const stores = [
    { name: 'Santiago',       lat: -33.4489, lng: -70.6693 },
    { name: 'Puerto Montt',   lat: -41.4689, lng: -72.9411 },
    { name: 'Villarrica',     lat: -39.2857, lng: -72.2279 },
    { name: 'Nacimiento',     lat: -37.5028, lng: -72.6736 },
    { name: 'Viña del Mar',   lat: -33.0153, lng: -71.5500 },
    { name: 'Valparaíso',     lat: -33.0472, lng: -71.6127 },
    { name: 'Concepción',     lat: -36.8201, lng: -73.0444 }
  ];
  const map = L.map('map');
  const bounds = L.latLngBounds(stores.map(s => [s.lat, s.lng]));
  map.fitBounds(bounds, { padding: [30, 30] });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  stores.forEach(s => L.marker([s.lat, s.lng]).addTo(map).bindPopup(`<strong>${s.name}</strong>`));
  setTimeout(()=> map.invalidateSize(), 300);
  window.addEventListener('resize', ()=> map.invalidateSize());
})();