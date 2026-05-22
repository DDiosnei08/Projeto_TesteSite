export const reviews = [
  {
    name: "Ricardo M.",
    role: "Empresário Rural",
    text: "Atendimento impecável do início ao fim. Comprei uma Hilux e a transparência sobre o estado do carro foi o diferencial. Nicolau Autos é, sem dúvida, a melhor da região.",
    initials: "RM"
  },
  {
    name: "Dra. Helena S.",
    role: "Médica",
    text: "Procurei um SUV para minha família e encontrei não só o carro, mas um consultor que realmente entende de segurança e conforto. Entrega rápida e documentação sem burocracia.",
    initials: "HS"
  },
  {
    name: "João Paulo F.",
    role: "Engenheiro",
    text: "Troquei meu sedan por um modelo mais novo e a avaliação do meu usado foi muito justa. É raro encontrar uma loja com esse nível de seriedade hoje em dia.",
    initials: "JP"
  }
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function buildReviewCard(r) {
  const card = el('div', 'review-card');

  const stars = el('div', 'flex gap-1 mb-4');
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('i');
    s.setAttribute('data-lucide', 'star');
    s.className = 'w-4 h-4 text-gold fill-gold';
    stars.appendChild(s);
  }
  card.appendChild(stars);

  const quote = el('p', 'text-gray-300 leading-relaxed mb-6 italic');
  quote.textContent = `"${r.text}"`;
  card.appendChild(quote);

  const footer = el('div', 'flex items-center gap-3 pt-5 border-t border-white/5');
  const avatar = el('div', 'w-12 h-12 rounded-full bg-gradient-to-br from-gold to-yellow-700 flex items-center justify-center font-bold text-black', r.initials);
  footer.appendChild(avatar);
  const info = el('div');
  info.appendChild(el('p', 'font-semibold', r.name));
  info.appendChild(el('p', 'text-xs text-gray-500', r.role));
  footer.appendChild(info);
  card.appendChild(footer);

  return card;
}

export function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  grid.replaceChildren();
  reviews.forEach(r => grid.appendChild(buildReviewCard(r)));
  if (window.lucide) window.lucide.createIcons();
}
