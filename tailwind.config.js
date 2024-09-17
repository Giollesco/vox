const colors = require('./src/ui/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        Urbanist: ['Urbanist'],
      },
      borderRadius: {
        '4xl': 20,
        '5xl': 24,
        '6xl': 28,
      },
      colors,
    },
  },
  plugins: [],
};
