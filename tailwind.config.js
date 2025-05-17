/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        income: '#16a34a',
        expense: '#dc2626',
        accent: '#f59e0b',
        grayLight: '#f9fafb',
        grayDark: '#1f2937',
      },
      boxShadow: {
        card: '0 4px 8px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        xl: '1rem',
      },
      animation: {
        'pulse-border': 'pulse-border 2s infinite',
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': { boxShadow: '0 0 10px #f59e0b' },
          '50%': { boxShadow: '0 0 20px #f59e0b' },
        },
      },
    },
  },
  plugins: [],
}
