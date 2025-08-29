/** @type {import('tailwindcss').Config} */
export default {
 content: [
    "./src/**/*.{js,jsx,ts,tsx}", // React project ke liye
  ],
  theme: {
    extend: {
      colors:{
        'dark':'#212121',
        'dark-light' :'#303030',
        'text':'white'
      }
    },
  },
  plugins: [],
}

