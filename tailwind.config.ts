import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f5f7fb',
          100: '#e8edf6',
          200: '#cfd9eb',
          300: '#a8bddc',
          400: '#7a96c7',
          500: '#5977b0',
          600: '#445d93',
          700: '#394b77',
          800: '#333f61',
          900: '#2c344f',
        },
      },
      boxShadow: {
        card: '0 20px 60px -30px rgba(25, 35, 60, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
