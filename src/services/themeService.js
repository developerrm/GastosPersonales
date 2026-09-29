// Theme & UI Customization Service for FinanzTitan

const THEME_STORAGE_KEY = 'finanztitan_theme_config_v1';

export const THEMES = [
  {
    id: 'titanium',
    name: 'Titanium Gold',
    category: 'dark',
    description: 'Estilo metálico titanio oscuro con acentos dorados y platino',
    badgeClass: 'from-amber-400 to-amber-600',
    primaryColor: '#f59e0b',
    bgColor: '#080b12',
    surfaceColor: '#141c2c',
    swatches: ['#080b12', '#141c2c', '#f59e0b', '#fde047', '#f8fafc'],
    icon: '👑'
  },
  {
    id: 'rose',
    name: 'Rose Blossom (Pink Balloon)',
    category: 'light',
    description: 'Paleta luminosa inspirada en globos rosa: fondo crema malvavisco, tarjetas blancas y fucsia neón',
    badgeClass: 'from-pink-500 via-rose-500 to-pink-300',
    primaryColor: '#ff0055',
    bgColor: '#fff5f7',
    surfaceColor: '#ffffff',
    swatches: ['#ff0055', '#c94b79', '#f080a2', '#ffd0dc', '#fff5f7'],
    icon: '🎈'
  },
  {
    id: 'cupcake',
    name: 'Cupcake Pastel (Mint & Rose)',
    category: 'light',
    description: 'Paleta inspirada en cupcakes: verde menta, azul cielo, crema suave, rosa fondant y azul petróleo',
    badgeClass: 'from-cyan-600 via-teal-400 to-pink-300',
    primaryColor: '#0e7490',
    bgColor: '#f4faf9',
    surfaceColor: '#ffffff',
    swatches: ['#0f6b85', '#76c7ed', '#9fe5db', '#e2dedb', '#fba4b7'],
    icon: '🧁'
  },
  {
    id: 'cyber',
    name: 'Cyber Neon',
    category: 'dark',
    description: 'Azul espacial profundo con destellos cian eléctrico y zafiro',
    badgeClass: 'from-cyan-400 to-blue-600',
    primaryColor: '#38bdf8',
    bgColor: '#060b18',
    surfaceColor: '#0f172a',
    swatches: ['#060b18', '#0f172a', '#0284c7', '#38bdf8', '#7dd3fc'],
    icon: '⚡'
  },
  {
    id: 'emerald',
    name: 'Emerald Obsidian',
    category: 'dark',
    description: 'Carbón oscuro con reflejos verde esmeralda y menta luminoso',
    badgeClass: 'from-emerald-400 to-teal-600',
    primaryColor: '#10b981',
    bgColor: '#07130f',
    surfaceColor: '#0e1f18',
    swatches: ['#07130f', '#0e1f18', '#059669', '#10b981', '#6ee7b7'],
    icon: '🌿'
  },
  {
    id: 'amethyst',
    name: 'Amethyst Royal',
    category: 'dark',
    description: 'Índigo oscuro con acentos púrpura real, violeta y magenta',
    badgeClass: 'from-purple-400 to-fuchsia-600',
    primaryColor: '#a855f7',
    bgColor: '#0e091b',
    surfaceColor: '#18122c',
    swatches: ['#0e091b', '#18122c', '#9333ea', '#a855f7', '#d8b4fe'],
    icon: '🔮'
  },
  {
    id: 'sunset',
    name: 'Sunset Bronze',
    category: 'dark',
    description: 'Cobre metálico y carbón cálido con brillo ámbar y fuego',
    badgeClass: 'from-orange-400 to-rose-600',
    primaryColor: '#f97316',
    bgColor: '#140c08',
    surfaceColor: '#24140e',
    swatches: ['#140c08', '#24140e', '#ea580c', '#f97316', '#fdba74'],
    icon: '🔥'
  },
  {
    id: 'oled',
    name: 'OLED Pure Black',
    category: 'dark',
    description: 'Negro absoluto ultra minimalista con bordes de alto contraste',
    badgeClass: 'from-zinc-300 to-zinc-600',
    primaryColor: '#e4e4e7',
    bgColor: '#000000',
    surfaceColor: '#09090b',
    swatches: ['#000000', '#09090b', '#27272a', '#a1a1aa', '#ffffff'],
    icon: '🌑'
  },
  {
    id: 'light',
    name: 'Titanium Minimal (Claro)',
    category: 'light',
    description: 'Modo claro minimalista con fondos limpios y máxima legibilidad',
    badgeClass: 'from-sky-400 to-indigo-500',
    primaryColor: '#0284c7',
    bgColor: '#f8fafc',
    surfaceColor: '#ffffff',
    swatches: ['#f8fafc', '#ffffff', '#0284c7', '#38bdf8', '#0f172a'],
    icon: '☀️'
  }
];

export const BORDER_RADIUS_OPTIONS = [
  { id: 'sharp', label: 'Recto / Sharp', value: '4px', radiusSm: '2px', radiusLg: '6px', desc: 'Bordes rectos técnicos' },
  { id: 'subtle', label: 'Sutil', value: '8px', radiusSm: '4px', radiusLg: '10px', desc: 'Curvatura leve y limpia' },
  { id: 'modern', label: 'Moderno', value: '14px', radiusSm: '8px', radiusLg: '18px', desc: 'Equilibrado y suave (Defecto)' },
  { id: 'curved', label: 'Ultra Curvo', value: '22px', radiusSm: '12px', radiusLg: '26px', desc: 'Estilo fluido y redondeado' }
];

export const DENSITY_OPTIONS = [
  { id: 'compact', label: 'Compacta', desc: 'Máxima densidad, menos scroll, fuentes condensadas' },
  { id: 'balanced', label: 'Equilibrada', desc: 'Espaciado estándar equilibrado' },
  { id: 'spacious', label: 'Espaciosa', desc: 'Márgenes amplios y mayor respiración visual' }
];

export const CARD_STYLES = [
  { id: 'metallic', label: 'Metálico & Glass', desc: 'Brillos, degradados de titanio y efecto cristal' },
  { id: 'flat', label: 'Minimalista Plano', desc: 'Superficies sólidas, limpias y sin reflejos' },
  { id: 'glow', label: 'Bordes Neón / Aura', desc: 'Bordes iluminados con brillo sutil' }
];

export const DEFAULT_THEME_SETTINGS = {
  theme: 'titanium',
  borderRadius: 'modern',
  density: 'balanced',
  cardStyle: 'metallic',
  // Table visual hierarchy preferences
  highlightActiveMonth: true,
  zebraStripes: true,
  crosshairHover: true,
  showProgressMini: true,
  monthViewRange: 'all', // 'all' | 'quarter' | 'semester'
  // Minimalist / section display preferences
  minimalistMode: false,
  showKpiCards: true,
  showUpcomingWidget: true
};

export const themeService = {
  getSettings: () => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_THEME_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Error reading theme settings', e);
    }
    return DEFAULT_THEME_SETTINGS;
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
      themeService.applyToDOM(settings);
      return true;
    } catch (e) {
      console.error('Error saving theme settings', e);
      return false;
    }
  },

  applyToDOM: (settings) => {
    const root = document.documentElement;
    const body = document.body;

    // 1. Data attributes
    root.setAttribute('data-theme', settings.theme || 'titanium');
    root.setAttribute('data-radius', settings.borderRadius || 'modern');
    root.setAttribute('data-density', settings.density || 'balanced');
    root.setAttribute('data-card-style', settings.cardStyle || 'metallic');
    
    if (settings.minimalistMode) {
      root.setAttribute('data-minimalist', 'true');
    } else {
      root.removeAttribute('data-minimalist');
    }

    // 2. CSS Variables for Border Radius
    const radiusObj = BORDER_RADIUS_OPTIONS.find((r) => r.id === settings.borderRadius) || BORDER_RADIUS_OPTIONS[2];
    root.style.setProperty('--app-radius', radiusObj.value);
    root.style.setProperty('--app-radius-sm', radiusObj.radiusSm);
    root.style.setProperty('--app-radius-lg', radiusObj.radiusLg);

    // 3. Density paddings
    if (settings.density === 'compact') {
      root.style.setProperty('--app-table-py', '0.35rem');
      root.style.setProperty('--app-table-px', '0.5rem');
      root.style.setProperty('--app-card-p', '0.75rem');
    } else if (settings.density === 'spacious') {
      root.style.setProperty('--app-table-py', '0.85rem');
      root.style.setProperty('--app-table-px', '1rem');
      root.style.setProperty('--app-card-p', '1.5rem');
    } else {
      root.style.setProperty('--app-table-py', '0.6rem');
      root.style.setProperty('--app-table-px', '0.75rem');
      root.style.setProperty('--app-card-p', '1rem');
    }
  },

  resetSettings: () => {
    localStorage.removeItem(THEME_STORAGE_KEY);
    themeService.applyToDOM(DEFAULT_THEME_SETTINGS);
    return DEFAULT_THEME_SETTINGS;
  }
};
