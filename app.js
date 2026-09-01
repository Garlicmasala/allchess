import { LOCALES, filterVariants, getVariant, hashPassword, randomSalt, verifyPassword } from './core.js';

// UI selectors
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
  '5d': '5D'
};

// Game state
let selectedId = 'chess';
let selectedSquare = null;
let pieces = new Map();
let turn = 'white';
let creating = false;
let activeMode = 'classic';

// ============================================================================
// VARIANT LIBRARY - User Story: Browse and select chess variants
// ============================================================================

function renderCards() {
  const variants = filterVariants($('#search').value, $('#era-filter').value);
  grid.innerHTML = variants.map((variant) => `
    <button class="variant-card ${variant.id === selectedId ? 'selected' : ''}" 
            data-id="${variant.id}" 
            style="--accent:${variant.accent}">
      <span class="card-top"><small>${variant.era}</small></span>
      <span class="variant-art art-${variant.id}" aria-hidden="true"><b>${variant.glyph}</b></span>
      <strong>${variant.name}</strong>
      <span>${variant.subtitle}</span>
      <i>${variant.dimensions.join(' × ')}</i>
    </button>
  `).join('') || '<p class="empty">No worlds match that search.</p>';

  grid.querySelectorAll('.variant-card').forEach((card) => 
    card.addEventListener('click', () => selectVariant(card.dataset.id))
  );
}

function selectVariant(id) {
  selectedId = id;
  const variant = getVariant(id);
  activeMode = variant.id === 'shogi'
    ? 'drops'
    : variant.mode === 'race'
      ? 'race'
      : variant.mode === 'hex'
        ? 'hex'
        : variant.mode === 'circular'
          ? 'circular'
          : variant.mode === '4d'
            ? '4d'
            : variant.mode === '5d'
              ? '5d'
              : 'classic';
  $('#selected-name').textContent = variant.name;
  $('#selected-subtitle').textContent = variant.subtitle;
  $('#dimension-label').textContent = variant.dimensions.join(' × ');
  $('#selected-mode').textContent = MODE_META[activeMode] || 'Classic';
  renderCards();
  renderBoard(variant);
}

function renderModeTabs(variant) {
  if (!modeTabs) return;
  const modes = variant.id === 'shogi'
    ? [{ id: 'drops', label: 'Drops' }, { id: 'rules', label: 'Rules' }, { id: 'promote', label: 'Promote' }]
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

  modeTabs.innerHTML = modes.map((option, index) => `<button class="mode-tab ${option.id === activeMode ? 'active' : ''}" data-mode="${option.id}">${option.label}</button>`).join('');
  modeTabs.querySelectorAll('.mode-tab').forEach((button) => button.addEventListener('click', () => {
    modeTabs.querySelectorAll('.mode-tab').forEach((node) => node.classList.toggle('active', node === button));
    activeMode = button.dataset.mode;
    $('#selected-mode').textContent = MODE_META[activeMode] || button.textContent.trim();
    const variant = getVariant(selectedId);
    updateBoardPosition(variant);
  }));
}

// ============================================================================
// GAME BOARD - User Story: Render board with proper dimensions for each variant
// ============================================================================

function renderBoard(variant) {
  const [columns, rows] = variant.dimensions.slice(-2);
  const board = $('#board');
  selectedSquare = null;
  turn = 'white';
  if (!activeMode || activeMode === 'rules' && variant.id === 'shogi') {
    activeMode = variant.id === 'shogi' ? 'drops' : 'classic';
  }
  pieces = createPieces(variant, columns);

  board.style.setProperty('--columns', columns);
  board.style.setProperty('--rows', rows);
  board.innerHTML = Array.from({ length: columns * rows }, (_, index) => {
    const isLight = (Math.floor(index / columns) + index) % 2 === 0;
    return `<button class="square ${isLight ? 'light' : 'dark'}" 
                    data-square="${index}" 
                    aria-label="Square ${index + 1}">
              ${pieces.get(index)?.symbol || ''}
            </button>`;
  }).join('');

  board.querySelectorAll('.square').forEach((square) => 
    square.addEventListener('click', () => moveSquare(Number(square.dataset.square)))
  );

  renderModeTabs(variant);
  updateBoardPosition(variant);
}

function updateBoardPosition(variant) {
  const msgs = {
    'race': 'Roll to move',
    '5d': 'Timeline 01 · White to move',
    'default': `${turn === 'white' ? 'White' : 'Black'} to move`
  };
  const msg = variant.mode === 'race' ? msgs.race 
            : variant.mode === '5d' ? msgs['5d']
            : `${turn === 'white' ? 'White' : 'Black'} to move`;
  $('#board-position').textContent = msg;
}

// ============================================================================
// PIECE SETUP - User Story: Create proper starting positions for all variants
// ============================================================================

function createPieces(variant, columns) {
  const position = new Map();

  // Race games (Royal Game of Ur)
  if (variant.mode === 'race') {
    ['●', '●', '○', '○', '●', '○'].forEach((symbol, index) => 
      position.set(index, { symbol, side: index % 2 ? 'black' : 'white', type: 'token' })
    );
    return position;
  }

  if (variant.id === 'shogi') {
    const shogiBackRank = ['lance', 'knight', 'silver', 'gold', 'king', 'gold', 'silver', 'knight', 'lance'];
    const shogiWhiteBackRank = ['lance', 'knight', 'silver', 'gold', 'king', 'gold', 'silver', 'knight', 'lance'];
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

    shogiBackRank.forEach((kind, file) => {
      position.set(file, { kind, symbol: symbolMap[kind], side: 'black', promoted: false, type: 'shogi' });
    });

    // standard shogi second rank: pawns
    for (let file = 0; file < 9; file += 1) {
      position.set(9 + file, { kind: 'pawn', symbol: '歩', side: 'black', promoted: false, type: 'shogi' });
      position.set((9 * 7) + file, { kind: 'pawn', symbol: '歩', side: 'white', promoted: false, type: 'shogi' });
    }

    shogiWhiteBackRank.forEach((kind, file) => {
      position.set((9 * 8) + file, { kind, symbol: symbolMap[kind], side: 'white', promoted: false, type: 'shogi' });
    });

    return position;
  }

  // Non-standard Chess variants
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
            '♜': '♖', '♞': '♘', '♝': '♗', '♛': '♕', '♚': '♔'
          }[piece]));
      position.set((columns * 2) + index, { symbol: whiteSymbol, side: 'white', type: 'piece' });
    });
    return position;
  }

  // Standard Chess 8×8
  const backRank = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  const symbols = { rook: '♜', knight: '♞', bishop: '♝', queen: '♛', king: '♚', pawn: '♟' };

  backRank.forEach((type, file) => {
    // Black pieces
    position.set(file, { type, side: 'black', symbol: symbols[type] });
    position.set(columns + file, { type: 'pawn', side: 'black', symbol: symbols.pawn });

    // White pieces
    const whiteSymbol = symbols[type].replace(/[♜♞♝♛♚♟]/, (piece) => ({
      '♜': '♖', '♞': '♘', '♝': '♗', '♛': '♕', '♚': '♔', '♟': '♙'
    }[piece]));
    position.set((columns * 7) + file, { type, side: 'white', symbol: whiteSymbol });
    position.set((columns * 6) + file, { type: 'pawn', side: 'white', symbol: '♙' });
  });

  return position;
}

// ============================================================================
// MOVE VALIDATION - User Story: Validate moves according to chess rulebooks
// ============================================================================

function canMove(from, to, columns, rows, piece) {
  const fromX = from % columns;
  const fromY = Math.floor(from / columns);
  const toX = to % columns;
  const toY = Math.floor(to / columns);
  const dx = toX - fromX;
  const dy = toY - fromY;
  const target = pieces.get(to);

  // Cannot move outside board or to same-side piece
  if (to < 0 || to >= columns * rows || target?.side === piece.side) {
    return false;
  }

  if (piece.type === 'shogi') {
    const kind = piece.kind || 'pawn';
    const direction = piece.side === 'white' ? 1 : -1;

    if (kind === 'pawn') {
      return dx === 0 && dy === direction && !target;
    }
    if (kind === 'lance') {
      if (dx !== 0 || dy === 0) return false;
      return dy * direction > 0 && !pieces.has(to);
    }
    if (kind === 'knight') {
      return (Math.abs(dx) === 1 && Math.abs(dy) === 2 && dy * direction > 0) ||
             (Math.abs(dx) === 2 && Math.abs(dy) === 1 && dy * direction > 0);
    }
    if (kind === 'silver') {
      return (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && dy * direction >= -1 && !(dx === 0 && dy === -direction)) && !((dx === 0 && dy === 0));
    }
    if (kind === 'gold') {
      return Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && !(dx === 0 && dy === -direction * 2) && !(Math.abs(dx) === 1 && dy === direction);
    }
    if (kind === 'bishop') {
      if (Math.abs(dx) !== Math.abs(dy)) return false;
      const stepX = Math.sign(dx); const stepY = Math.sign(dy);
      for (let x = fromX + stepX, y = fromY + stepY; x !== toX || y !== toY; x += stepX, y += stepY) {
        if (pieces.has(y * columns + x)) return false;
      }
      return true;
    }
    if (kind === 'rook') {
      if (dx !== 0 && dy !== 0) return false;
      const stepX = Math.sign(dx); const stepY = Math.sign(dy);
      for (let x = fromX + stepX, y = fromY + stepY; x !== toX || y !== toY; x += stepX, y += stepY) {
        if (pieces.has(y * columns + x)) return false;
      }
      return true;
    }
    if (kind === 'king') {
      return Math.max(Math.abs(dx), Math.abs(dy)) === 1;
    }
  }

  // Pawn movement (FIDE rulebook: Article 3.2)
  if (piece.type === 'pawn') {
    const direction = piece.side === 'white' ? -1 : 1;
    const isStartingRow = piece.side === 'white' ? fromY === 6 : fromY === 1;

    // Forward move
    if (dx === 0) {
      if (dy === direction && !target) return true;
      if (isStartingRow && dy === direction * 2 && !target && !pieces.get(from + direction * columns)) {
        return true;
      }
      return false;
    }

    // Diagonal capture
    return dy === direction && Math.abs(dx) === 1 && Boolean(target);
  }

  // Knight movement (FIDE rulebook: Article 3.3)
  if (piece.type === 'knight') {
    return (Math.abs(dx) === 1 && Math.abs(dy) === 2) || 
           (Math.abs(dx) === 2 && Math.abs(dy) === 1);
  }

  // King movement (FIDE rulebook: Article 3.5)
  if (piece.type === 'king') {
    return Math.max(Math.abs(dx), Math.abs(dy)) === 1;
  }

  // Bishop, Rook, Queen movement
  const diagonal = Math.abs(dx) === Math.abs(dy);
  const straight = dx === 0 || dy === 0;

  if ((piece.type === 'bishop' && !diagonal) || 
      (piece.type === 'rook' && !straight) || 
      (piece.type === 'queen' && !diagonal && !straight)) {
    return false;
  }

  // Check path is clear (no pieces blocking)
  const stepX = Math.sign(dx);
  const stepY = Math.sign(dy);
  for (let x = fromX + stepX, y = fromY + stepY; 
       x !== toX || y !== toY; 
       x += stepX, y += stepY) {
    if (pieces.has(y * columns + x)) {
      return false;
    }
  }

  return true;
}

// ============================================================================
// GAME INTERACTION - User Story: Handle piece selection and move execution
// ============================================================================

function moveSquare(index) {
  const squares = [...$('#board').querySelectorAll('.square')];
  const variant = getVariant(selectedId);

  // First click: select piece
  if (selectedSquare === null) {
    const piece = pieces.get(index);
    const enforceRules = shouldEnforceRules(variant, activeMode);

    if (!piece) return;
    if (enforceRules && piece.side !== turn) return; // Wrong color

    selectedSquare = index;
    squares[index].classList.add('active');
    return;
  }

  // Second click: execute move
  const [columns, rows] = variant.dimensions.slice(-2);
  const movingPiece = pieces.get(selectedSquare);
  const enforceRules = shouldEnforceRules(variant, activeMode);

  // Check if move is legal
  const isLegalMove = !enforceRules || canMove(selectedSquare, index, columns, rows, movingPiece);

  // Deselect if clicking same square
  if (selectedSquare === index) {
    squares[index].classList.remove('active');
    selectedSquare = null;
    return;
  }

  // Execute valid move
  if (isLegalMove) {
    pieces.set(index, movingPiece);
    pieces.delete(selectedSquare);
    squares[index].textContent = squares[selectedSquare].textContent;
    squares[selectedSquare].textContent = '';
    turn = turn === 'white' ? 'black' : 'white';
    updateBoardPosition(variant);
  }

  squares[selectedSquare]?.classList.remove('active');
  selectedSquare = null;
}

function shouldEnforceRules(variant, mode = activeMode) {
  const ruleBookVariants = ['chess', 'chaturanga', 'xiangqi', 'makruk', 'shatranj', 'janggi', 'sittuyin', 'shogi'];
  if (variant.id === 'shogi') {
    return mode === 'rules' || mode === 'promote' || mode === 'drops';
  }
  if (variant.mode === 'race' || variant.mode === 'hex' || variant.mode === 'circular' || variant.mode === '4d' || variant.mode === '5d') {
    return false;
  }
  return ruleBookVariants.includes(variant.id) || variant.mode === 'classic' || mode === 'rules';
}

// ============================================================================
// LOCALIZATION - User Story: Support multiple languages for UI
// ============================================================================

function applyLocale(locale) {
  const trans = LOCALES[locale] || LOCALES.en;
  document.documentElement.lang = locale;
  // Update any other UI elements that need translation
}

// ============================================================================
// AUTHENTICATION - User Story: Support local user accounts with password hashing
// ============================================================================

async function submitAuth(event) {
  event.preventDefault();
  const error = $('#form-error');
  error.textContent = '';

  try {
    const email = $('#auth-email').value;
    const password = $('#auth-password').value;
    const existing = JSON.parse(localStorage.getItem(`allchess.user.${email}`) || 'null');

    if (creating) {
      // Create new account
      if (existing) throw new Error('Email already registered.');
      const salt = randomSalt();
      const hash = await hashPassword(password, salt);
      localStorage.setItem(`allchess.user.${email}`, JSON.stringify({ salt, hash }));
    } else {
      // Sign in
      if (!existing) throw new Error('Email not found.');
      const isValid = await verifyPassword(password, existing.salt, existing.hash);
      if (!isValid) throw new Error('Email or password is incorrect.');
    }

    localStorage.setItem('allchess.session', email);
    $('#auth-dialog').close();
    $('#auth-open').textContent = email.split('@')[0];
    $('#auth-email').value = '';
    $('#auth-password').value = '';
  } catch (authError) {
    error.textContent = authError.message;
  }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

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

// ============================================================================
// INITIALIZATION
// ============================================================================

renderCards();
selectVariant(selectedId);