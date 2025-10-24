/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
    "./node_modules/flowbite/**/*.js",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#1E2A3A",       
        secondary: "#034B7D",     
        accent: "#0E8390",        
        netral: "#ffffff",        
        background: "#F9FAFB",    
        darkbg: "#1a1c23",        
        "text-main": "var(--color-text-main)", 
      },
      boxShadow: {
        soft: "0 4px 30px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },

  plugins: [
    require("flowbite/plugin"), 
  ],
};
