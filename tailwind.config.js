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
