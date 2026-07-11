import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0B0B0B',
        panel: '#141414',
        accent: '#E50914',
      },
      boxShadow: {
        glow: '0 0 28px rgba(229, 9, 20, 0.28)',
        card: '0 18px 60px rgba(0, 0, 0, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
