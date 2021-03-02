const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
	   './resources/**/*.blade.php',
     './resources/**/*.js',
     './resources/**/*.css',

  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
        'light-blue': colors.lightBlue,
        cyan: colors.cyan,
    },
      screens: {
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
