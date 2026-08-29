import { LOCALES, filterVariants, getVariant, hashPassword, randomSalt, verifyPassword } from './core.js';

const $ = (selector) => document.querySelector(selector);
const grid = $('#variant-grid');
let selectedId = 'chess';
let creating = false;
let selectedSquare = null;
let pieces = [];

function renderCards() {
  const variants = filterVariants($('#search').value, $('#era-filter').value);
  grid.innerHTML = variants.map((variant) => `<button class="variant-card ${variant.id === selectedId ? 'selected' : ''}" data-id="${variant.id}" style="--accent:${variant.accent}"><span class="card-top"><small>${variant.era}</small></span><span class="variant-art art-${variant.id}" aria-hidden="true"><b>${variant.glyph}</b></span><strong>${variant.name}</strong><span>${variant.subtitle}</span><i>${variant.dimensions.join(' × ')}</i></button>`).join('') || '<p class="empty">No worlds match that search.</p>';
  grid.querySelectorAll('.variant-card').forEach((card) => card.addEventListener('click', () => selectVariant(card.dataset.id)));
}

function selectVariant(id) {
  selectedId = id;
  const variant = getVariant(id);
  $('#selected-name').textContent = variant.name;
  $('#selected-subtitle').textContent = variant.subtitle;
  $('#dimension-label').textContent = variant.dimensions.join(' × ');
  renderCards();
  renderBoard(variant);
}

function renderBoard(variant) {
  const [columns, rows] = variant.dimensions.slice(-2);
  const board = $('#board');
  selectedSquare = null;
  board.style.setProperty('--columns', columns);
  board.style.setProperty('--rows', rows);
  pieces = variant.mode === 'classic' ? ['♜','♞','♝','♛','♚','♝','♞','♜'] : variant.mode === 'drops' ? ['歩','香','桂','銀','金','角','飛','王'] : [];
  board.innerHTML = Array.from({ length: columns * rows }, (_, index) => `<button class="square ${(Math.floor(index / columns) + index) % 2 ? 'dark' : 'light'}" data-square="${index}" aria-label="Square ${index + 1}">${index < pieces.length ? pieces[index] : ''}</button>`).join('');
  board.querySelectorAll('.square').forEach((square) => square.addEventListener('click', () => moveSquare(Number(square.dataset.square))));
  $('#board-position').textContent = variant.mode === 'race' ? 'Roll to move' : variant.mode === '5d' ? 'Timeline 01 · White to move' : 'White to move';
}

function moveSquare(index) {
  const squares = [...$('#board').querySelectorAll('.square')];
  if (selectedSquare === null) {
    if (!squares[index].textContent) return;
    selectedSquare = index;
    squares[index].classList.add('active');
    return;
  }
  if (selectedSquare !== index) {
    squares[index].textContent = squares[selectedSquare].textContent;
    squares[selectedSquare].textContent = '';
    $('#board-position').textContent = 'Move recorded · White to move';
  }
  squares[selectedSquare].classList.remove('active');
  selectedSquare = null;
}

function applyLocale(locale) {
  const copy = LOCALES[locale] || LOCALES.en;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((element) => { if (copy[element.dataset.i18n]) element.textContent = copy[element.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => { element.placeholder = copy[element.dataset.i18nPlaceholder]; });
}

async function submitAuth(event) {
  event.preventDefault();
  const email = $('#auth-email').value.trim().toLowerCase();
  const password = $('#auth-password').value;
  const error = $('#form-error');
  error.textContent = '';
  try {
    const accounts = JSON.parse(localStorage.getItem('allchess.accounts') || '{}');
    const existing = accounts[email];
    if (creating) {
      if (existing) throw new Error('An account already exists for this email.');
      const salt = randomSalt();
      accounts[email] = { salt, hash: await hashPassword(password, salt) };
      localStorage.setItem('allchess.accounts', JSON.stringify(accounts));
    } else if (!existing || !(await verifyPassword(password, existing.salt, existing.hash))) throw new Error('Email or password is incorrect.');
    localStorage.setItem('allchess.session', email);
    $('#auth-dialog').close();
    $('#auth-open').textContent = email.split('@')[0];
  } catch (authError) { error.textContent = authError.message; }
}

$('#search').addEventListener('input', renderCards);
$('#era-filter').addEventListener('change', renderCards);
$('#locale').addEventListener('change', (event) => applyLocale(event.target.value));
$('#reset-board').addEventListener('click', () => renderBoard(getVariant(selectedId)));
$('#auth-open').addEventListener('click', () => $('#auth-dialog').showModal());
$('#auth-close').addEventListener('click', () => $('#auth-dialog').close());
$('#auth-form').addEventListener('submit', submitAuth);
$('#auth-switch').addEventListener('click', () => { creating = !creating; $('#auth-title').textContent = creating ? LOCALES[$('#locale').value].create : LOCALES[$('#locale').value].welcome; $('#auth-switch').textContent = creating ? LOCALES[$('#locale').value].signIn : LOCALES[$('#locale').value].create; });
renderCards();
selectVariant(selectedId);