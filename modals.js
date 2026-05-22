const formatBRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export function initModals() {
  const modal = document.getElementById('financingModal');
  if (!modal) return;

  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close-modal]') || e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  ['finPrice', 'finEntrada', 'finPrazoRange'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateSimulation);
  });

  updateSimulation();
}

function closeModal() {
  const modal = document.getElementById('financingModal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

export function openFinancingModal({ name, price }) {
  const modal = document.getElementById('financingModal');
  document.getElementById('finVehicleName').textContent = name ? `Simule para o ${name}.` : 'Calcule a parcela ideal para o seu novo veículo.';
  if (price && !isNaN(price)) {
    document.getElementById('finPrice').value = price;
  }
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  updateSimulation();
  if (window.lucide) window.lucide.createIcons();
}

function updateSimulation() {
  const price = parseFloat(document.getElementById('finPrice').value) || 0;
  const entradaPct = parseInt(document.getElementById('finEntrada').value);
  const prazo = parseInt(document.getElementById('finPrazoRange').value);

  document.getElementById('finEntradaPct').textContent = `${entradaPct}%`;
  document.getElementById('finPrazo').textContent = prazo;

  const entradaValue = price * (entradaPct / 100);
  const financiado = price - entradaValue;
  const taxa = 0.0149;
  const parcela = financiado > 0
    ? (financiado * taxa * Math.pow(1 + taxa, prazo)) / (Math.pow(1 + taxa, prazo) - 1)
    : 0;

  document.getElementById('finEntradaValue').textContent = formatBRL(entradaValue);
  document.getElementById('finFinanciado').textContent = formatBRL(financiado);
  document.getElementById('finParcela').textContent = formatBRL(parcela);
}
