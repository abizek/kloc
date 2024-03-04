/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      'h-sm': { raw: '(min-height: 640px)' },
      ...defaultTheme.screens,
    },
    extend: {},
  },
  plugins: [],
}
