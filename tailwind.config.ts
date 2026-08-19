import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C1417',
        date: '#27131D',
        pomegranate: '#7B2142',
        jade: '#155C55',
        saffron: '#C78B37',
        copper: '#B8744D',
        'copper-deep': '#8E4F34',
        sand: '#F5E8D8',
        pearl: '#FFF9F2',
        shade: '#74645F',
        hair: '#D9C5B4',
      },
      fontFamily: {
        display: ['"Aref Ruqaa"', '"Bodoni Moda"', 'serif'],
        body: ['"IBM Plex Sans Arabic"', 'Manrope', 'sans-serif'],
        latin: ['"Bodoni Moda"', 'serif'],
      },
      letterSpacing: {
        editorial: '0.18em',
      },
      transitionTimingFunction: {
        quiet: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
