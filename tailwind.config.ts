import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        surface: '#020617',
        primary: {
          50: '#e0f2ff',
          100: '#b9e0ff',
          200: '#8fcdff',
          300: '#65b9ff',
          400: '#3da7ff',
          500: '#148fff',
          600: '#0b71db',
          700: '#064fa3',
          800: '#03306b',
          900: '#011634',
        },
        accent: '#22c55e',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      maxWidth: {
        'content': '1120px',
      },
    },
  },
  plugins: [],
};

export default config;
