/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Scans all JS/JSX/TS/TSX files in src
    './src/components/**/*.{js,jsx,ts,tsx}', // Scans all components and their folders
    './public/index.html', // Scans your HTML files, if applicable
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

