import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // iOS applies :hover on tap and keeps it until the next tap, leaving cards lifted.
  future: {
    hoverOnlyWhenSupported: true,
  },
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
  plugins: [
    // A phone on its side: too short for the stacked portrait layout, too narrow for the
    // desktop one. A plugin variant rather than a screen, so `max-lg:` stays available.
    // Plugin variants are emitted before the screen variants, so `:root` lifts the
    // specificity for it to win over `sm:` and `md:`; it never overlaps `lg:`.
    plugin(({ addVariant }) => {
      addVariant('short', '@media (max-width: 1023.98px) and (max-height: 500px) { :root & }');
    }),
  ],
} satisfies Config;
