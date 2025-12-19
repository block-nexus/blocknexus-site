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
        background: '#030712',
        surface: '#0a0f1a',
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
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        'content': '1280px',
      },
      fontSize: {
        'display': ['5.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['4.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'heading': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-sm': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'body-lg': ['1.375rem', { lineHeight: '1.6' }],
        'body': ['1.25rem', { lineHeight: '1.7' }],
        'body-sm': ['1.125rem', { lineHeight: '1.6' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
