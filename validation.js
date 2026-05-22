export function sanitizeText(input) {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str
    .replace(new RegExp('<', 'g'), '&lt;')
    .replace(new RegExp('>', 'g'), '&gt;')
    .replace(new RegExp('"', 'g'), '&quot;')
    .replace(new RegExp("'", 'g'), '&#39;')
    .replace(new RegExp('javascript:', 'gi'), '')
    .trim();
}

export function isValidPhoneBR(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(new RegExp('\\D', 'g'), '');
  return digits.length >= 10 && digits.length <= 13;
}

export function isValidName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 80;
}

export function isValidYear(year) {
  const n = parseInt(year, 10);
  if (Number.isNaN(n)) return false;
  return n >= 1980 && n <= 2030;
}

export function isValidText(text, min, max) {
  if (typeof text !== 'string') return false;
  const t = text.trim();
  return t.length >= (min || 1) && t.length <= (max || 100);
}

export function validateTradeInForm(data) {
  const errors = [];
  if (!isValidName(data.nome)) errors.push('Nome');
  if (!isValidPhoneBR(data.telefone)) errors.push('Telefone');
  if (!isValidText(data.marca, 1, 40)) errors.push('Marca');
  if (!isValidText(data.modelo, 1, 40)) errors.push('Modelo');
  if (!isValidYear(data.ano)) errors.push('Ano');
  if (!isValidText(data.km, 1, 20)) errors.push('Quilometragem');
  return { valid: errors.length === 0, errors };
}

export function filterVehiclesByCategory(vehicles, category) {
  if (!Array.isArray(vehicles)) return [];
  if (!category || category === 'all') return vehicles.slice();
  return vehicles.filter(v => v && v.category === category);
}

export function detectXSS(input) {
  if (typeof input !== 'string') return false;
  const patterns = [
    new RegExp('<\\s*script', 'i'),
    new RegExp('javascript\\s*:', 'i'),
    new RegExp('on\\w+\\s*=', 'i'),
    new RegExp('<\\s*iframe', 'i'),
    new RegExp('<\\s*img[^>]+onerror', 'i')
  ];
  return patterns.some(p => p.test(input));
}
