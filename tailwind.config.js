/** @type {import('tailwindcss').Config} */
// Colors are CSS variables (see src/index.css) so light/dark mode and the
// accent palette can switch at runtime. Format: space-separated RGB channels.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: v('paper'),
        ink: v('ink'),
        muted: v('muted'),
        line: v('line'),
        surface: v('surface'),
        accent: v('accent'),
        'accent-fg': v('accent-fg'),
        primary: v('accent'),
        rose: v('ink'),
        blush: v('ink'),
        lavender: v('muted'),
        lilac: v('muted'),
        peach: v('line'),
        gold: v('line'),
        dark: v('paper'),
        'dark-secondary': v('surface'),
        'dark-tertiary': v('paper'),
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', '"Playfair Display"', 'Georgia', 'serif'],
        sora: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'ping-slow': 'ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 0.7s infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'fall': 'fall 12s linear infinite',
        'twinkle': 'twinkle 2.5s ease-in-out infinite',
        'blob': 'blob 18s ease-in-out infinite',
        'gradient-flow': 'gradient-flow 6s ease infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fall: {
          '0%': { transform: 'translate(0, -10vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translate(var(--drift, 0px), 110vh) rotate(360deg)', opacity: '0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        blob: {
          '0%, 100%': { borderRadius: '42% 58% 63% 37% / 41% 44% 56% 59%', transform: 'translate(0,0) rotate(0deg)' },
          '33%': { borderRadius: '58% 42% 37% 63% / 56% 59% 41% 44%', transform: 'translate(3%,-4%) rotate(8deg)' },
          '66%': { borderRadius: '37% 63% 58% 42% / 44% 41% 59% 56%', transform: 'translate(-3%,4%) rotate(-8deg)' },
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
