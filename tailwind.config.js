/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mac: {
          bg: '#1e1e1e',
          card: '#252526',
          border: '#333333',
          toolbar: '#2a2a2a',
          sidebar: '#222222',
          accent: '#0a84ff',
          hover: 'rgba(255, 255, 255, 0.08)',
          active: 'rgba(255, 255, 255, 0.15)',
        },
      },
    },
  },
  plugins: [],
};
