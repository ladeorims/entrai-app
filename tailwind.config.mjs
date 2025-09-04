// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // CHANGE: Enabling dark mode via the 'class' strategy
  darkMode: 'class',
  theme: {
    extend: {
      // CHANGE: Replaced the entire color palette with the new design system
      colors: {
        // Light Theme
        'primary-bg': '#F8F9FA',
        'card-bg': '#FFFFFF',
        'text-primary': '#1E2022',
        'text-secondary': '#6C757D',
        'accent-start': '#4A90E2',
        'accent-end': '#9013FE',
        
        // Dark Theme
        'dark-primary-bg': '#121212',
        'dark-card-bg': '#1E1E1E',
        'dark-text-primary': '#EAEAEA',
        'dark-text-secondary': '#8B8B8D',
        'dark-accent-start': '#00F2A9',
        'dark-accent-mid': '#2D9CDB',
        'dark-accent-end': '#9B51E0',
      },
    },
  },
  plugins: [

  ],
};