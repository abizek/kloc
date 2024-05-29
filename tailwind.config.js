/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'
import tailwindCssAnimatePlugin from 'tailwindcss-animate'

export default {
  content: ['./index.html', './src/client/**/*.{ts,tsx}'],
  theme: {
    screens: {
      'h-sm': { raw: '(min-height: 640px)' },
      ...defaultTheme.screens,
    },
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
        '.no-scrollbar::webkit-scrollbar': {
          display: 'none',
        },
      })
    }),
    tailwindCssAnimatePlugin,
  ],
}
