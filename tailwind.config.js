/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kr: {
          bg: '#090a0f',
          surface: '#12141c',
          card: '#181b26',
          cardHover: '#1f2333',
          border: '#262b3d',
          borderLight: '#323952',
          text: '#f1f5f9',
          muted: '#808ba0',
          dim: '#4f566b',
          accent: '#8b5cf6',       // Electric Purple
          accentGlow: '#a78bfa',
          cyan: '#06b6d4',         // Cyber Cyan
          cyanGlow: '#22d3ee',
          lime: '#10b981',         // Neon Lime / Success Emerald
          amber: '#f59e0b',        // Streak Amber
          ruby: '#f43f5e',         // Error Ruby / Mistake Red
          coral: '#fb7185',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'monospace'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-lime': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-ruby': '0 0 25px -5px rgba(244, 63, 94, 0.4)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'caret-blink': 'caretBlink 1s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'combo-bounce': 'comboBounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        caretBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        comboBounce: {
          '0%': { transform: 'scale(0.85)' },
          '70%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
