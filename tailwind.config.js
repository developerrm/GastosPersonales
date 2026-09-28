/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        metal: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#141c2c',
          900: '#0f172a',
          950: '#090d16',
        },
        titanium: {
          light: '#3a4454',
          DEFAULT: '#222b3a',
          dark: '#161c28',
          darker: '#0d111a',
        },
        platinum: {
          light: '#f1f5f9',
          DEFAULT: '#e2e8f0',
          dark: '#94a3b8',
        },
        gold: {
          light: '#fde047',
          DEFAULT: '#eab308',
          dark: '#ca8a04',
          metallic: '#d4af37',
        }
      },
      backgroundImage: {
        'metallic-gradient': 'linear-gradient(135deg, #2a3444 0%, #151c27 50%, #252f3f 100%)',
        'metallic-card': 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
        'metallic-shine': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        'metallic-gold': 'linear-gradient(135deg, #ffd700 0%, #d4af37 40%, #996515 100%)',
        'metallic-silver': 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 35%, #64748b 70%, #94a3b8 100%)',
        'metallic-cyan': 'linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #0369a1 100%)',
        'metallic-emerald': 'linear-gradient(135deg, #34d399 0%, #059669 50%, #047857 100%)',
        'metallic-ruby': 'linear-gradient(135deg, #f87171 0%, #dc2626 50%, #991b1b 100%)',
        'metallic-border-glow': 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03), rgba(255,255,255,0.15))',
      },
      boxShadow: {
        'metallic': '0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 rgba(0, 0, 0, 0.5)',
        'metallic-lg': '0 20px 40px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        'metallic-glow-gold': '0 0 25px -5px rgba(234, 179, 8, 0.3)',
        'metallic-glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'metallic-glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'metallic-glow-ruby': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
        'inner-bevel': 'inset 1px 1px 2px rgba(255, 255, 255, 0.15), inset -1px -1px 2px rgba(0, 0, 0, 0.6)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        }
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
