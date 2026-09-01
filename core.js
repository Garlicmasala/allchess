export const VARIANTS = [
  { id: 'ur', era: 'Ancient', name: 'Royal Game of Ur', subtitle: 'Race game · c. 2600 BCE', dimensions: [3, 8], mode: 'race', glyph: '𒀭', accent: '#dd6b3d' },
  { id: 'chaturanga', era: 'Ancient', name: 'Chaturanga', subtitle: 'Four armies · India', dimensions: [8, 8], mode: 'classic', glyph: 'च', accent: '#c18b3c' },
  { id: 'xiangqi', era: 'Classical', name: 'Xiangqi', subtitle: 'River chess · China', dimensions: [9, 10], mode: 'classic', glyph: '象', accent: '#db5a4a' },
  { id: 'chess', era: 'Modern', name: 'Chess', subtitle: 'The royal game · FIDE', dimensions: [8, 8], mode: 'classic', glyph: '♞', accent: '#2f7d6d' },
  { id: 'shogi', era: 'Modern', name: 'Shogi', subtitle: 'The generals game · Japan', dimensions: [9, 9], mode: 'drops', glyph: '将', accent: '#b88946' },
  { id: 'makruk', era: 'Modern', name: 'Makruk', subtitle: 'Thai chess · Thailand', dimensions: [8, 8], mode: 'classic', glyph: 'ม', accent: '#ba5c59' },
  { id: 'shatranj', era: 'Classical', name: 'Shatranj', subtitle: 'Persian chess · 7th century', dimensions: [8, 8], mode: 'classic', glyph: 'شاه', accent: '#8c6b4f' },
  { id: 'janggi', era: 'Modern', name: 'Janggi', subtitle: 'Korean chess · Korea', dimensions: [9, 10], mode: 'classic', glyph: '將', accent: '#3f7092' },
  { id: 'sittuyin', era: 'Modern', name: 'Sittuyin', subtitle: 'Burmese chess · Myanmar', dimensions: [8, 8], mode: 'classic', glyph: 'သ', accent: '#a75a3d' },
  { id: 'xiangqi-mini', era: 'Classical', name: 'Mini Xiangqi', subtitle: 'Compact river chess', dimensions: [7, 7], mode: 'classic', glyph: '楚', accent: '#a46743' },
  { id: 'alice', era: 'Experimental', name: 'Alice Chess', subtitle: 'Two boards · one move', dimensions: [8, 8, 2], mode: '4d', glyph: '↔', accent: '#4c7b83' },
  { id: 'hexagonal', era: 'Experimental', name: 'Hexagonal Chess', subtitle: 'Glinski board · 91 cells', dimensions: [11, 11], mode: 'hex', glyph: '⬡', accent: '#587d66' },
  { id: 'circular', era: 'Experimental', name: 'Circular Chess', subtitle: 'The board has no edge', dimensions: [16, 16], mode: 'circular', glyph: '◉', accent: '#a85e62' },
  { id: 'tamerlane', era: 'Classical', name: 'Tamerlane Chess', subtitle: 'Persian imperial chess · 14th century', dimensions: [11, 10], mode: 'classic', glyph: 'ت', accent: '#916b52' },
  { id: 'courier', era: 'Classical', name: 'Courier Chess', subtitle: 'Medieval Europe · 12 × 8', dimensions: [12, 8], mode: 'classic', glyph: '✉', accent: '#756b57' },
  { id: 'capablanca', era: 'Modern', name: 'Capablanca Chess', subtitle: 'Two new pieces · 10 × 8', dimensions: [10, 8], mode: 'classic', glyph: 'C', accent: '#817249' },
  { id: 'chess960', era: 'Modern', name: 'Chess960', subtitle: '960 starting positions', dimensions: [8, 8], mode: 'classic', glyph: '⟳', accent: '#477b68' },
  { id: 'atomic', era: 'Modern', name: 'Atomic Chess', subtitle: 'Captures create explosions', dimensions: [8, 8], mode: 'classic', glyph: '✹', accent: '#bb5844' },
  { id: 'horde', era: 'Modern', name: 'Horde Chess', subtitle: '36 pawns against an army', dimensions: [8, 8], mode: 'classic', glyph: '♟', accent: '#9b663e' },
  { id: 'raumschach', era: 'Experimental', name: 'Raumschach', subtitle: 'Five stacked 5 × 5 boards', dimensions: [5, 5, 5], mode: '5d', glyph: '▦', accent: '#557aa0' },
  { id: 'three-dimensional', era: 'Experimental', name: 'Three-dimensional Chess', subtitle: 'Star Trek · seven boards', dimensions: [8, 8, 7], mode: '4d', glyph: '▤', accent: '#4f728b' },
  { id: 'dragonfly', era: 'Experimental', name: 'Dragonfly Chess', subtitle: 'Hexes and asymmetric wings', dimensions: [7, 7], mode: 'hex', glyph: '✺', accent: '#68845f' },
  { id: 'grand', era: 'Experimental', name: 'Grand Chess', subtitle: '10 × 10 · 100 squares', dimensions: [10, 10], mode: 'classic', glyph: 'G', accent: '#a16b4c' },
  { id: 'chinese-three-dimensional', era: 'Classical', name: 'Three Kingdoms Chess', subtitle: 'Xiangqi with a third army', dimensions: [9, 10], mode: 'classic', glyph: '魏', accent: '#a34f45' },
  { id: 'sennen', era: 'Classical', name: 'Sennen Shogi', subtitle: 'Japanese large-board chess', dimensions: [16, 16], mode: 'drops', glyph: '千', accent: '#9a6d3f' },
  { id: 'courier-extended', era: 'Classical', name: 'Courier Extended', subtitle: 'A wider medieval battlefield', dimensions: [12, 12], mode: 'classic', glyph: '✥', accent: '#76614e' },
  { id: 'fischerandom', era: 'Modern', name: 'Fischer Random', subtitle: 'Chess with a shuffled start', dimensions: [8, 8], mode: 'classic', glyph: '♜', accent: '#387668' },
  { id: 'los-alamos', era: 'Modern', name: 'Los Alamos Chess', subtitle: 'Six pieces · 6 × 6', dimensions: [6, 6], mode: 'classic', glyph: 'L', accent: '#9a7048' },
  { id: 'antichess', era: 'Modern', name: 'Antichess', subtitle: 'Lose every piece to win', dimensions: [8, 8], mode: 'classic', glyph: '×', accent: '#a34c58' },
  { id: 'cylinder', era: 'Experimental', name: 'Cylinder Chess', subtitle: 'The left edge meets the right', dimensions: [8, 8], mode: 'classic', glyph: '↻', accent: '#477b86' },
  { id: 'infinite', era: 'Experimental', name: 'Infinite Chess', subtitle: 'An unbounded square grid', dimensions: [12, 12], mode: 'classic', glyph: '∞', accent: '#5d759c' },
  { id: 'gridworld', era: 'Experimental', name: 'Gridworld', subtitle: 'Chess on a changing board', dimensions: [8, 8], mode: 'classic', glyph: '⌘', accent: '#668253' },
  { id: 'empire', era: 'Experimental', name: 'Empire Chess', subtitle: 'Territories grow with each move', dimensions: [10, 10], mode: 'classic', glyph: '♛', accent: '#9c624b' },
  { id: '4d', era: 'Experimental', name: '4D Chess', subtitle: 'Two boards · 4 dimensions', dimensions: [4, 4, 4, 4], mode: '4d', glyph: '◇', accent: '#5b78a8' },
  { id: '5d', era: 'Experimental', name: '5D Chess', subtitle: 'Time-travel strategy', dimensions: [5, 5, 5], mode: '5d', glyph: '✦', accent: '#7b639d' }
];

export const LOCALES = {
  en: { label: 'English', nav: 'Library', play: 'Playground', learn: 'Learn', signIn: 'Sign in', signOut: 'Sign out', search: 'Search variants', all: 'All games', featured: 'Featured worlds', account: 'Local account', email: 'Email', password: 'Password', create: 'Create account', welcome: 'Welcome back', localOnly: 'Your account stays on this device.', apply: 'Enter playground' },
  es: { label: 'Español', nav: 'Biblioteca', play: 'Tablero', learn: 'Aprender', signIn: 'Entrar', signOut: 'Salir', search: 'Buscar variantes', all: 'Todos los juegos', featured: 'Mundos destacados', account: 'Cuenta local', email: 'Correo', password: 'Contraseña', create: 'Crear cuenta', welcome: 'Bienvenido', localOnly: 'Tu cuenta permanece en este dispositivo.', apply: 'Entrar al tablero' },
  ja: { label: '日本語', nav: 'ライブラリ', play: 'プレイグラウンド', learn: '学ぶ', signIn: 'ログイン', signOut: 'ログアウト', search: 'バリアントを検索', all: 'すべてのゲーム', featured: '注目の世界', account: 'ローカルアカウント', email: 'メール', password: 'パスワード', create: 'アカウント作成', welcome: 'おかえりなさい', localOnly: 'アカウントはこの端末に保存されます。', apply: 'プレイグラウンドへ' },
  ar: { label: 'العربية', nav: 'المكتبة', play: 'ساحة اللعب', learn: 'تعلّم', signIn: 'تسجيل الدخول', signOut: 'تسجيل الخروج', search: 'ابحث عن لعبة', all: 'كل الألعاب', featured: 'عوالم مميزة', account: 'حساب محلي', email: 'البريد الإلكتروني', password: 'كلمة المرور', create: 'إنشاء حساب', welcome: 'مرحباً بعودتك', localOnly: 'يبقى حسابك على هذا الجهاز.', apply: 'دخول ساحة اللعب' }
};

export function getVariant(id) { return VARIANTS.find((variant) => variant.id === id) || VARIANTS[3]; }
export function filterVariants(query, era = 'All') {
  const needle = query.trim().toLowerCase();
  return VARIANTS.filter((variant) => (era === 'All' || variant.era === era) && `${variant.name} ${variant.subtitle}`.toLowerCase().includes(needle));
}

export function randomSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password, salt) {
  if (!password || password.length < 10) throw new Error('Password must be at least 10 characters');
  const encoded = new TextEncoder().encode(password);
  const key = await crypto.subtle.importKey('raw', encoded, 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 120000, hash: 'SHA-256' }, key, 256);
  return [...new Uint8Array(bits)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password, salt, expectedHash) { return (await hashPassword(password, salt)) === expectedHash; }