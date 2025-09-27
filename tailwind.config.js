/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-gray-900': '#1a1a1a',
        'dark-gray-800': '#2a2a2a',
        'dark-gray-600': '#4a4a4a',
        'light-gray-200': '#e0e0e0',
        'green-500': '#4CAF50',
        'red-500': '#F44336',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
