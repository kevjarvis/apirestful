/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js,hbs}", "./views/**/*.hbs"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
}
