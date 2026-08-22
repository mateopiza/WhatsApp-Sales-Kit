/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F9F6F0',
          100: '#FAF8F3',
          200: '#F2ECE1',
          300: '#E6DCCF',
        },
        atelier: {
          DEFAULT: '#121110',
          light: '#23201E',
          dark: '#0A0A09',
        },
        gold: {
          DEFAULT: '#C5A059',
          light: '#DFBD78',
          dark: '#9E7C3B',
        },
        velvet: {
          DEFAULT: '#6B1D2F',
          dark: '#4A121F',
        },
        grey: {
          DEFAULT: '#8C867D',
          light: '#B5AFA6',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};
