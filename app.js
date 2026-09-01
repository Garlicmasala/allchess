import { LOCALES, filterVariants, getVariant, hashPassword, randomSalt, verifyPassword } from './core.js';

const $ = (selector) => document.querySelector(selector);
const grid = $('#variant-grid');
const modeTabs = $('#mode-tabs');

const MODE_META = {
  classic: 'Classic',
  rules: 'Rules',
  drops: 'Drops',
  race: 'Race',
  hex: 'Hex',
  circular: 'Circular',
  '4d': '4D',
  '5d': '5D',
  promote: 'Promote'
};

let selectedId = 'chess';
let selectedSquare = null;
let pieces = new Map();
let turn = 'white';
let creating = false;
let activeMode = 'classic';

function getDefaultMode(variant) {
  if (variant.id === 'shogi') return 'drops';
  if (variant.mode === 'race') return 'race';
  if (variant.mode === 'hex') return 'hex';
  if (variant.mode === 'circular') return 'circular';
  if (variant.mode === '4d') return '4d';
  if (variant.mode === '5d') return '5d';
  return 'classic';
}

function renderCards() {
  const variants = filterVariants($('#search').value, $('#era-filter').value);
  grid.innerHTML = variants.map((variant) => `
    <button class="variant-card ${variant.id === selectedId ? 'selected' : ''}" data-id="${variant.id}" style="--accent:${variant.accent}">
      <div class="card-top">
        <small>${variant.era}</small>
        <span class="pill">${variant.mode}</span>
      </div>
      <div class="variant-art art-${variant.id}" aria-hidden="true"><b>${variant.glyph}</b></div>
      <strong>${variant.name}</strong>
      <span>${variant.subtitle}</span>
      <i>${variant.dimensions.join(' × ')}</i>
    </button>
  `).join('') || '<p class="empty">No worlds match that search.</p>';

  grid.querySelectorAll('.variant-card').forEach((card) => {
    card.addEventListener('click', () => selectVariant(card.dataset.id));
  });
}

function renderModeTabs(variant) {
  if (!modeTabs) return;

  const modes = variant.id === 'shogi'
    ? [
        { id: 'drops', label: 'Drops' },
        { id: 'rules', label: 'Rules' },
        { id: 'promote', label: 'Promote' }
      ]
    : variant.mode === 'race'
      ? [{ id: 'race', label: 'Race' }]
      : variant.mode === 'hex'
        ? [{ id: 'hex', label: 'Hex' }]
        : variant.mode === 'circular'
          ? [{ id: 'circular', label: 'Circular' }]
          : variant.mode === '4d'
            ? [{ id: '4d', label: '4D' }]
            : variant.mode === '5d'
              ? [{ id: '5d', label: '5D' }]
              : [{ id: 'classic', label: 'Classic' }, { id: 'rules', label: 'Rules' }];

  modeTabs.innerHTML = modes.map((option) => `
    <button type="button" class="mode-tab ${option.id === activeMode ? 'active' : ''}" data-mode="${option.id}">${option.label}</button>
  `).join('');

  modeTabs.querySelectorAll('.mode-tab').forEach((button) => {
    button.addEventListener('click', () => {
      activeMode = button.dataset.mode;
      modeTabs.querySelectorAll('.mode-tab').forEach((node) => node.classList.toggle('active', node === button));
      $('#selected-mode').textContent = MODE_META[activeMode] || button.textContent.trim();
      updateBoardPosition(variant);
    });
  });
}

function selectVariant(id) {
  selectedId = id;
  const variant = getVariant(id);
  activeMode = getDefaultMode(variant);
  $('#selected-name').textContent = variant.name;
  $('#selected-subtitle').textContent = variant.subtitle;
  $('#dimension-label').textContent = variant.dimensions.join(' × ');
  $('#selected-mode').textContent = MODE_META[activeMode] || 'Classic';
  renderCards();
  renderBoard(variant);
}

function renderBoard(variant) {
  const [columns, rows] = variant.dimensions.slice(-2);
  const board = $('#board');
  selectedSquare = null;
  turn = 'white';
  pieces = createPieces(variant, columns);

  board.style.setProperty('--columns', columns);
  board.style.setProperty('--rows', rows);
  board.innerHTML = Array.from({ length: columns * rows }, (_, index) => {
    const isLight = (Math.floor(index / columns) + index) % 2 === 0;
    return `<button class="square ${isLight ? 'light' : 'dark'}" data-square="${index}" aria-label="Square ${index + 1}">${pieces.get(index)?.symbol || ''}</button>`;
  }).join('');

  board.querySelectorAll('.square').forEach((square) => {
    square.addEventListener('click', () => moveSquare(Number(square.dataset.square)));
  });

  renderModeTabs(variant);
  updateBoardPosition(variant);
}

function updateBoardPosition(variant) {
  if (variant.id === 'shogi') {
    $('#board-position').textContent = `${MODE_META[activeMode] || 'Drops'} · ${turn === 'white' ? 'White' : 'Black'} to move`;
    return;
  }

  if (variant.mode === 'race') {
    $('#board-position').textContent = 'Roll to move';
    return;
  }

  if (variant.mode === '5d') {
    $('#board-position').textContent = 'Timeline 01 · White to move';
    return;
  }

  $('#board-position').textContent = `${turn === 'white' ? 'White' : 'Black'} to move`;
}

function createPieces(variant, columns) {
  const position = new Map();

  if (variant.mode === 'race') {
    ['●', '●', '○', '○', '●', '○'].forEach((symbol, index) => {
      position.set(index, { symbol, side: index % 2 ? 'black' : 'white', type: 'token' });
    });
    return position;
  }

  if (variant.id === 'shogi') {
    const backRank = ['lance', 'knight', 'silver', 'gold', 'king', 'gold', 'silver', 'knight', 'lance'];
    const symbolMap = {
      lance: '香',
      knight: '桂',
      silver: '銀',
      gold: '金',
      king: '王',
      bishop: '角',
      rook: '飛',
      pawn: '歩'
    };

    backRank.forEach((kind, file) => {
      position.set(file, { kind, symbol: symbolMap[kind], side: 'black', promoted: false, type: 'shogi' });
    });

    for (let file = 0; file < 9; file += 1) {
      position.set(9 + file, { kind: 'pawn', symbol: '歩', side: 'black', promoted: false, type: 'shogi' });
      position.set((9 * 7) + file, { kind: 'pawn', symbol: '歩', side: 'white', promoted: false, type: 'shogi' });
    }

    backRank.forEach((kind, file) => {
      position.set((9 * 8) + file, { kind, symbol: symbolMap[kind], side: 'white', promoted: false, type: 'shogi' });
    });

    return position;
  }

  if (variant.id !== 'chess') {
    const symbols = variant.mode === 'drops'
      ? ['歩', '香', '桂', '銀', '金', '角', '飛', '王']
      : ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];

    const usablePieces = symbols.slice(0, columns);
    usablePieces.forEach((symbol, index) => {
      position.set(index, { symbol, side: 'black', type: 'piece' });
      const whiteSymbol = variant.mode === 'drops'
        ? symbol
        : symbol.replace(/[♜♞♝♛♚]/, (piece) => ({
            '♜': '♖',
            '♞': '♘',
            '♝': '♗',
            '♛': '♕',
            '♚': '♔'
          }[piece]));
      position.set((columns * 2) + index, { symbol: whiteSymbol, side: 'white', type: 'piece' });
    });
    return position;
  }

  const backRank = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  const symbols = { rook: '♜', knight: '♞', bishop: '♝', queen: '♛', king: '♚', pawn: '♟' };

  backRank.forEach((type, file) => {
    position.set(file, { type, side: 'black', symbol: symbols[type] });
    position.set(columns + file, { type: 'pawn', side: 'black', symbol: symbols.pawn });

    const whiteSymbol = symbols[type].replace(/[♜♞♝♛♚♟]/, (piece) => ({
      '♜': '♖',
      '♞': '♘',
      '♝': '♗',
      '♛': '♕',
      '♚': '♔',
      '♟': '♙'
    }[piece]));

    position.set((columns * 7) + file, { type, side: 'white', symbol: whiteSymbol });
    position.set((columns * 6) + file, { type: 'pawn', side: 'white', symbol: '♙' });
  });

  return position;
}

function canMove(from, to, columns, rows, piece) {
  const fromX = from % columns;
  const fromY = Math.floor(from / columns);
  const toX = to % columns;
  const toY = Math.floor(to / columns);
  const dx = toX - fromX;
  const dy = toY - fromY;
  const target = pieces.get(to);

  if (to < 0 || to >= columns * rows || target?.side === piece.side) return false;

  if (piece.type === 'shogi') {
    const kind = piece.kind || 'pawn';
    const direction = piece.side === 'white' ? 1 : -1;

    if (kind === 'pawn') return dx === 0 && dy === direction && !target;
    if (kind === 'lance') return dx === 0 && dy * direction > 0 && !target;
    if (kind === 'knight') return (Math.abs(dx) === 1 && Math.abs(dy) === 2) || (Math.abs(dx) === 2 && Math.abs(dy) === 1);
    if (kind === 'silver') return Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && !(dx === 0 && dy === 0) && dy * direction >= -1 && !(dx === 0 && dy === -direction);
    if (kind === 'gold') return Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && !(dx === 0 && dy === 0) && !((Math.abs(dx) === 1 && dy === direction));
    if (kind === 'king') return Math.max(Math.abs(dx), Math.abs(dy)) === 1;
    if (kind === 'rook') {
      if (dx !== 0 && dy !== 0) return false;
      const stepX = Math.sign(dx);
      const stepY = Math.sign(dy);
      for (let x = fromX + stepX, y = fromY + stepY; x !== toX || y !== toY; x += stepX, y += stepY) {
        if (pieces.has(y * columns + x)) return false;
      }
      return true;
    }
    if (kind === 'bishop') {
      if (Math.abs(dx) !== Math.abs(dy)) return false;
      const stepX = Math.sign(dx);
      const stepY = Math.sign(dy);
      for (let x = fromX + stepX, y = fromY + stepY; x !== toX || y !== toY; x += stepX, y += stepY) {
        if (pieces.has(y * columns + x)) return false;
      }
      return true;
    }
  }

  if (piece.type === 'pawn') {
    const direction = piece.side === 'white' ? -1 : 1;
    const isStartingRow = piece.side === 'white' ? fromY === 6 : fromY === 1;

    if (dx === 0) {
      if (dy === direction && !target) return true;
      if (isStartingRow && dy === direction * 2 && !target && !pieces.get(from + direction * columns)) {
        return true;
      }
      return false;
    }

    return dy === direction && Math.abs(dx) === 1 && Boolean(target);
  }

  if (piece.type === 'knight') {
    return (Math.abs(dx) === 1 && Math.abs(dy) === 2) || (Math.abs(dx) === 2 && Math.abs(dy) === 1);
  }

  if (piece.type === 'king') {
    return Math.max(Math.abs(dx), Math.abs(dy)) === 1;
  }

  const diagonal = Math.abs(dx) === Math.abs(dy);
  const straight = dx === 0 || dy === 0;

  if ((piece.type === 'bishop' && !diagonal) || (piece.type === 'rook' && !straight) || (piece.type === 'queen' && !diagonal && !straight)) {
    return false;
  }

  const stepX = Math.sign(dx);
  const stepY = Math.sign(dy);
  for (let x = fromX + stepX, y = fromY + stepY; x !== toX || y !== toY; x += stepX, y += stepY) {
    if (pieces.has(y * columns + x)) return false;
  }

  return true;
}

function moveSquare(index) {
  const squares = [...$('#board').querySelectorAll('.square')];
  const variant = getVariant(selectedId);

  if (selectedSquare === null) {
    const piece = pieces.get(index);
    const enforceRules = shouldEnforceRules(variant, activeMode);
    if (!piece) return;
    if (enforceRules && piece.side !== turn) return;
    selectedSquare = index;
    squares[index].classList.add('active');
    return;
  }

  const [columns, rows] = variant.dimensions.slice(-2);
  const movingPiece = pieces.get(selectedSquare);
  const enforceRules = shouldEnforceRules(variant, activeMode);
  const legal = !enforceRules || canMove(selectedSquare, index, columns, rows, movingPiece);

  if (selectedSquare === index) {
    squares[index].classList.remove('active');
    selectedSquare = null;
    return;
  }

  if (legal) {
    pieces.set(index, movingPiece);
    pieces.delete(selectedSquare);
    squares[index].textContent = squares[selectedSquare].textContent;
    squares[selectedSquare].textContent = '';
    turn = turn === 'white' ? 'black' : 'white';
    updateBoardPosition(variant);
  }

  squares[selectedSquare].classList.remove('active');
  selectedSquare = null;
}

function shouldEnforceRules(variant, mode = activeMode) {
  const ruleBookVariants = ['chess', 'chaturanga', 'xiangqi', 'makruk', 'shatranj', 'janggi', 'sittuyin', 'shogi'];

  if (variant.id === 'shogi') {
    return mode === 'rules' || mode === 'drops' || mode === 'promote';
  }

  if (variant.mode === 'race' || variant.mode === 'hex' || variant.mode === 'circular' || variant.mode === '4d' || variant.mode === '5d') {
    return false;
  }

  return ruleBookVariants.includes(variant.id) || variant.mode === 'classic' || mode === 'rules';
}

function applyLocale(locale) {
  const trans = LOCALES[locale] || LOCALES.en;
  document.documentElement.lang = locale;
  $('#auth-title').textContent = creating ? trans.create : trans.welcome;
}

async function submitAuth(event) {
  event.preventDefault();
  const error = $('#form-error');
  error.textContent = '';

  try {
    const email = $('#auth-email').value;
    const password = $('#auth-password').value;
    const existing = JSON.parse(localStorage.getItem(`allchessb.user.${email}`) || 'null');

    if (creating) {
      if (existing) throw new Error('Email already registered.');
      const salt = randomSalt();
      const hash = await hashPassword(password, salt);
      localStorage.setItem(`allchessb.user.${email}`, JSON.stringify({ salt, hash }));
    } else {
      if (!existing) throw new Error('Email not found.');
      const isValid = await verifyPassword(password, existing.salt, existing.hash);
      if (!isValid) throw new Error('Email or password is incorrect.');
    }

    localStorage.setItem('allchessb.session', email);
    $('#auth-dialog').close();
    $('#auth-open').textContent = email.split('@')[0];
    $('#auth-email').value = '';
    $('#auth-password').value = '';
  } catch (authError) {
    error.textContent = authError.message;
  }
}

$('#search').addEventListener('input', renderCards);
$('#era-filter').addEventListener('change', renderCards);
$('#locale').addEventListener('change', (event) => applyLocale(event.target.value));
$('#reset-board').addEventListener('click', () => renderBoard(getVariant(selectedId)));
$('#auth-open').addEventListener('click', () => $('#auth-dialog').showModal());
$('#auth-close').addEventListener('click', () => $('#auth-dialog').close());
$('#auth-form').addEventListener('submit', submitAuth);
$('#auth-switch').addEventListener('click', () => {
  creating = !creating;
  const locale = $('#locale').value || 'en';
  const trans = LOCALES[locale];
  $('#auth-title').textContent = creating ? trans.create : trans.welcome;
  $('#auth-switch').textContent = creating ? trans.signIn : trans.create;
});

renderCards();
selectVariant(selectedId);
