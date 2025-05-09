/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ljust tema
        'light-bg': '#f8f9fa',
        'light-surface': '#ffffff',
        'light-border': '#e2e8f0',
        'light-text': '#1a202c',
        'light-text-secondary': '#4a5568',
        'light-primary': '#0070f3',
        'light-primary-dark': '#0050b3',
        'light-accent': '#ff2d55',
        'light-success': '#30d158',
        'light-error': '#ff3b30',
        
        // Mörkt tema
        'dark-bg': '#121826',
        'dark-surface': '#1e293b',
        'dark-border': '#334155',
        'dark-text': '#f1f5f9',
        'dark-text-secondary': '#94a3b8',
        'dark-primary': '#0a84ff',
        'dark-primary-dark': '#0066cc',
        'dark-accent': '#ff375f',
        'dark-success': '#32d74b',
        'dark-error': '#ff453a',
      },
      boxShadow: {
        'light-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'light-md': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'light-lg': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'dark-sm': '0 2px 8px rgba(0, 0, 0, 0.25)',
        'dark-md': '0 4px 16px rgba(0, 0, 0, 0.35)',
        'dark-lg': '0 8px 30px rgba(0, 0, 0, 0.45)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}; 