/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {   
      fontFamily: {
        // Sobreescribimos la fuente por defecto ('sans') con tu tipografía exacta
        sans: ['AudiSans-Italic', 'sans-serif'],
      }
    },
  },
  plugins: [],
}