import {
  sanitizeText,
  isValidPhoneBR,
  isValidName,
  isValidYear,
  validateTradeInForm,
  filterVehiclesByCategory,
  detectXSS
} from './validation.js';
import { verifyAdminToken, siteConfig } from './site_config.js';

const results = [];

function assert(name, condition, details) {
  const passed = !!condition;
  results.push({ name, passed, details: details || '' });
}

function assertEqual(name, actual, expected) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({
    name,
    passed,
    details: passed ? '' : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
  });
}

async function runTests() {
  assertEqual('sanitizeText escapes <script>', sanitizeText('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  assertEqual('sanitizeText escapes quotes', sanitizeText('hello "world"'), 'hello &quot;world&quot;');
  assertEqual('sanitizeText handles null', sanitizeText(null), '');
  assertEqual('sanitizeText strips javascript:', sanitizeText('javascript:alert(1)'), 'alert(1)');
  assert('sanitizeText trims whitespace', sanitizeText('  ok  ') === 'ok');

  assert('detectXSS catches <script>', detectXSS('<script>x</script>'));
  assert('detectXSS catches onerror', detectXSS('<img src=x onerror=alert(1)>'));
  assert('detectXSS catches javascript:', detectXSS('javascript:void(0)'));
  assert('detectXSS allows safe text', !detectXSS('Olá, gostaria de informações'));

  assert('isValidPhoneBR accepts valid', isValidPhoneBR('(42) 99131-1244'));
  assert('isValidPhoneBR accepts +55', isValidPhoneBR('+55 42 99131-1244'));
  assert('isValidPhoneBR rejects short', !isValidPhoneBR('1234'));
  assert('isValidPhoneBR rejects empty', !isValidPhoneBR(''));

  assert('isValidName accepts normal name', isValidName('Sandro Nicolau'));
  assert('isValidName rejects single char', !isValidName('A'));
  assert('isValidName rejects empty', !isValidName(''));

  assert('isValidYear accepts 2024', isValidYear(2024));
  assert('isValidYear accepts string year', isValidYear('2020'));
  assert('isValidYear rejects 1900', !isValidYear(1900));
  assert('isValidYear rejects text', !isValidYear('abc'));

  const validForm = validateTradeInForm({
    nome: 'João Silva', telefone: '(42) 99131-1244',
    marca: 'Toyota', modelo: 'Hilux', ano: 2022, km: '45000', obs: ''
  });
  assert('validateTradeInForm valid passes', validForm.valid && validForm.errors.length === 0);

  const invalidForm = validateTradeInForm({
    nome: 'A', telefone: '12', marca: '', modelo: '', ano: 1800, km: ''
  });
  assert('validateTradeInForm invalid catches errors', !invalidForm.valid && invalidForm.errors.length >= 5);

  const mockVehicles = [
    { id: 1, category: 'suv' },
    { id: 2, category: 'pickup' },
    { id: 3, category: 'suv' },
    { id: 4, category: 'sedan' }
  ];
  assertEqual('filterVehiclesByCategory all returns all', filterVehiclesByCategory(mockVehicles, 'all').length, 4);
  assertEqual('filterVehiclesByCategory suv returns 2', filterVehiclesByCategory(mockVehicles, 'suv').length, 2);
  assertEqual('filterVehiclesByCategory pickup returns 1', filterVehiclesByCategory(mockVehicles, 'pickup').length, 1);
  assertEqual('filterVehiclesByCategory unknown returns 0', filterVehiclesByCategory(mockVehicles, 'invalid').length, 0);
  assertEqual('filterVehiclesByCategory non-array returns []', filterVehiclesByCategory(null, 'all'), []);

  assert('siteConfig exposes brand', siteConfig && siteConfig.brand === 'Nicolau Autos e Pick-ups');
  assert('verifyAdminToken rejects empty', !(await verifyAdminToken('')));
  assert('verifyAdminToken rejects null', !(await verifyAdminToken(null)));
  assert('verifyAdminToken rejects wrong token', !(await verifyAdminToken('wrong-token-123')));
  assert('verifyAdminToken returns boolean', typeof (await verifyAdminToken('any')) === 'boolean');

  renderResults();
}

function renderResults() {
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;

  console.group('%c🧪 Nicolau Autos · Test Suite', 'color:#d4af37;font-weight:bold;font-size:14px;');
  results.forEach(r => {
    if (r.passed) {
      console.log(`%c✓ ${r.name}`, 'color:#10b981;');
    } else {
      console.log(`%c✗ ${r.name} %c${r.details}`, 'color:#ef4444;font-weight:bold;', 'color:#9ca3af;');
    }
  });
  console.log(`%c${passed}/${total} passed · ${failed} failed`, `color:${failed === 0 ? '#10b981' : '#ef4444'};font-weight:bold;`);
  console.groupEnd();

  const panel = document.getElementById('testPanel');
  const body = document.getElementById('testPanelBody');
  const summary = document.getElementById('testPanelSummary');
  if (!panel || !body || !summary) return;

  body.replaceChildren();
  results.forEach(r => {
    const row = document.createElement('div');
    row.className = 'test-row ' + (r.passed ? 'pass' : 'fail');
    const icon = document.createElement('span');
    icon.className = 'test-icon';
    icon.textContent = r.passed ? '✓' : '✗';
    const label = document.createElement('span');
    label.className = 'test-label';
    label.textContent = r.name;
    row.appendChild(icon);
    row.appendChild(label);
    if (!r.passed && r.details) {
      const det = document.createElement('span');
      det.className = 'test-details';
      det.textContent = r.details;
      row.appendChild(det);
    }
    body.appendChild(row);
  });

  summary.textContent = `${passed}/${total} passed · ${failed} failed`;
  summary.className = 'test-panel-summary ' + (failed === 0 ? 'all-pass' : 'has-fail');

  const params = new URLSearchParams(window.location.search);
  if (params.has('qa') || params.has('test')) {
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'false');
  }

  document.getElementById('testPanelClose')?.addEventListener('click', () => {
    panel.classList.add('hidden');
    panel.setAttribute('aria-hidden', 'true');
  });

  window.__nicolauTestResults = { total, passed, failed, results };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(runTests, 100));
} else {
  setTimeout(runTests, 100);
}
