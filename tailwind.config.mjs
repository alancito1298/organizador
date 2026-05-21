/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {

      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        atma: ['Atma Bold', 'arial'],
        poppins: ['Poppins', 'sans-serif'],
      },

      keyframes: {

        vibrar: {

          '0%, 100%': {
            transform: 'translateX(0)',
          },

          '20%': {
            transform: 'translateX(-2px)',
          },

          '40%': {
            transform: 'translateX(2px)',
          },

          '60%': {
            transform: 'translateX(-2px)',
          },

          '80%': {
            transform: 'translateX(2px)',
          },

        },

      },

      animation: {

        vibrar:
          'vibrar 0.2s linear infinite',

      },

    },
  },

  plugins: [],
}