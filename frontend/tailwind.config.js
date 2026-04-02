module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        chocolate: {
          50: '#faf3e0',
          100: '#f0e2cc',
          200: '#e0c9a9',
          300: '#c7a27b',
          400: '#b47d5e',
          500: '#9c6348',
          600: '#7e4f39',
          700: '#633f2e',
          800: '#4f3225',
          900: '#3c271d',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};