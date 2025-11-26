/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a1f44',
          50: '#e6f0ff',
          100: '#bfd1ff',
          200: '#99b2ff',
          300: '#7292ff',
          400: '#4b73ff',
          500: '#2354ff',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        secondary: '#1f3b73',
        accent: '#2dd4bf',
        slate: {
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'elevated': '0 20px 45px rgba(9, 27, 62, 0.25)',
      },
    },
  },
  plugins: [],
}

