/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-red' : '#FF91A3',
        'custom-green' : '#A3FF91',
    },
  },
  plugins: [],
}
}
