/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", 
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E2A3A', 
        secondary: '#80C7FB', 
        accent: '#0E8390', 
        background: '#F9FAFB', 
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
