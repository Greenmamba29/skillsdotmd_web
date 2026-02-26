import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b8dcff',
          300: '#7ac0ff',
          400: '#3aa0ff',
          500: '#0080ff',
          600: '#0064db',
          700: '#004db3',
          800: '#003d8f',
          900: '#002d6b',
          950: '#001d47',
        },
      },
    },
  },
  plugins: [],
};

export default config;
