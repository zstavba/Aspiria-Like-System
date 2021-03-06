const colors = require('tailwindcss/colors')

module.exports = {
  important: true,
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
      cursor: {
        auto: 'auto',
        default: 'default',
        pointer: 'pointer',
       wait: 'wait',
        text: 'text',
       move: 'move',
        'not-allowed': 'not-allowed',
       crosshair: 'crosshair',
       'zoom-in': 'zoom-in',
      }
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
