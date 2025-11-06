/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#E65F2B',       // Figma orange for active links and highlights
        sidebar: '#1E1E1E',      // Dark sidebar background
        background: '#F9FAFB',   // Main page light background
        foreground: '#1F1F1F',   // Default text color
        border: '#E5E7EB',       // Border color
        muted: '#6B7280',         // Muted text
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],       // Main font
        decorative: ['Sansita Swashed', 'cursive'], // For logo/title
      },
    },
  },
  plugins: [],
};
