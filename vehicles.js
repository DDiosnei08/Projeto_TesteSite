export const vehicles = [
  {
    id: 1,
    name: "Pick-up 4x4 Premium",
    brand: "Linha Premium",
    year: "2024",
    km: "12.500 km",
    price: "R$ 289.900",
    priceNum: 289900,
    badge: "Financiamento em até 60x",
    category: "pickup",
    image: "assets/6810ad6bbeb330fd_premium_black_4x4_luxury_truck_studio_photo_index_1.jpeg"
  },
  {
    id: 2,
    name: "SUV Executivo",
    brand: "Linha Premium",
    year: "2024",
    km: "8.900 km",
    price: "R$ 245.000",
    priceNum: 245000,
    badge: "Entrada facilitada",
    category: "suv",
    image: "assets/d12075cb590a854e_luxury_suv_studio_photograph_index_2.jpeg"
  },
  {
    id: 3,
    name: "Sedan Esportivo",
    brand: "Linha Premium",
    year: "2023",
    km: "21.300 km",
    price: "R$ 198.500",
    priceNum: 198500,
    badge: "Aceita troca",
    category: "sedan",
    image: "assets/0c2c9be2473ddad1_luxury_sports_sedan_studio_render_index_3.jpeg"
  },
  {
    id: 4,
    name: "Pick-up Robusta",
    brand: "Linha Trabalho",
    year: "2023",
    km: "34.000 km",
    price: "R$ 219.900",
    priceNum: 219900,
    badge: "Pronta entrega",
    category: "pickup",
    image: "assets/6810ad6bbeb330fd_premium_black_4x4_luxury_truck_studio_photo_index_1.jpeg"
  },
  {
    id: 5,
    name: "SUV Família",
    brand: "Linha Premium",
    year: "2024",
    km: "5.100 km",
    price: "R$ 268.000",
    priceNum: 268000,
    badge: "Financiamento total",
    category: "suv",
    image: "assets/d12075cb590a854e_luxury_suv_studio_photograph_index_2.jpeg"
  },
  {
    id: 6,
    name: "Hatch Premium",
    brand: "Linha Urbana",
    year: "2023",
    km: "18.700 km",
    price: "R$ 119.900",
    priceNum: 119900,
    badge: "Taxa especial",
    category: "hatch",
    image: "assets/0c2c9be2473ddad1_luxury_sports_sedan_studio_render_index_3.jpeg"
  }
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function buildVehicleCard(v) {
  const article = el('article', 'vehicle-card group');
  article.dataset.cat = v.category;

  const imgWrap = el('div', 'relative overflow-hidden h-60 bg-gradient-to-br from-zinc-900 to-black');
  const img = document.createElement('img');
  img.src = v.image;
  img.alt = `${v.name} ${v.year} - venda em União da Vitória`;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.className = 'v-img w-full h-full object-cover';
  imgWrap.appendChild(img);

  const badge = el('div', 'absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/60 backdrop-blur border border-white/10 text-gold', v.badge);
  imgWrap.appendChild(badge);

  const cat = el('div', 'absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium bg-gold text-black uppercase tracking-wider', v.category);
  imgWrap.appendChild(cat);

  article.appendChild(imgWrap);

  const body = el('div', 'p-6');
  body.appendChild(el('p', 'text-xs uppercase tracking-[0.2em] text-gray-500 mb-2', v.brand));
  body.appendChild(el('h3', 'text-2xl font-playfair font-bold mb-1', v.name));

  const meta = el('div', 'flex items-center gap-3 text-sm text-gray-400 mb-5');
  const yearSpan = el('span', 'flex items-center gap-1');
  const yearIcon = document.createElement('i');
  yearIcon.setAttribute('data-lucide', 'calendar');
  yearIcon.className = 'w-3.5 h-3.5';
  yearSpan.appendChild(yearIcon);
  yearSpan.appendChild(document.createTextNode(' ' + v.year));
  meta.appendChild(yearSpan);
  meta.appendChild(el('span', 'w-1 h-1 rounded-full bg-gray-600'));
  const kmSpan = el('span', 'flex items-center gap-1');
  const kmIcon = document.createElement('i');
  kmIcon.setAttribute('data-lucide', 'gauge');
  kmIcon.className = 'w-3.5 h-3.5';
  kmSpan.appendChild(kmIcon);
  kmSpan.appendChild(document.createTextNode(' ' + v.km));
  meta.appendChild(kmSpan);
  body.appendChild(meta);

  const priceWrap = el('div', 'flex items-end justify-between mb-5');
  const priceInner = el('div');
  priceInner.appendChild(el('p', 'text-xs text-gray-500 uppercase tracking-wider', 'Preço'));
  priceInner.appendChild(el('p', 'text-2xl font-bold text-gold', v.price));
  priceWrap.appendChild(priceInner);
  body.appendChild(priceWrap);

  const interest = document.createElement('a');
  interest.href = `https://wa.me/5542991311244?text=${encodeURIComponent('Olá! Tenho interesse no ' + v.name + ' ' + v.year + '.')}`;
  interest.target = '_blank';
  interest.rel = 'noopener';
  interest.className = 'flex items-center justify-center gap-2 w-full py-3 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-gold hover:text-black hover:border-gold transition';
  interest.appendChild(document.createTextNode('Tenho Interesse '));
  const arrow = document.createElement('i');
  arrow.setAttribute('data-lucide', 'arrow-right');
  arrow.className = 'w-4 h-4';
  interest.appendChild(arrow);
  body.appendChild(interest);

  const sim = document.createElement('button');
  sim.setAttribute('data-simulate', '');
  sim.dataset.name = v.name;
  sim.dataset.price = v.priceNum;
  sim.className = 'btn-simulate';
  const calcIcon = document.createElement('i');
  calcIcon.setAttribute('data-lucide', 'calculator');
  calcIcon.className = 'w-4 h-4';
  sim.appendChild(calcIcon);
  sim.appendChild(document.createTextNode(' Simular Financiamento'));
  body.appendChild(sim);

  article.appendChild(body);
  return article;
}

export function renderVehicles(filter = 'all') {
  const grid = document.getElementById('vehiclesGrid');
  const filtered = filter === 'all' ? vehicles : vehicles.filter(v => v.category === filter);
  grid.replaceChildren();
  filtered.forEach(v => grid.appendChild(buildVehicleCard(v)));
  if (window.lucide) window.lucide.createIcons();
  document.dispatchEvent(new Event('vehiclesRendered'));
}
