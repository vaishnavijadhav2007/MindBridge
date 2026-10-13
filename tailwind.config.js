/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F3EBDD',         // Warm Beige
          sage: '#829675',       // Sage Green
          'sage-hover': '#718465',
          'sage-light': '#E9EFE7',
          'sage-subtle': '#D7E2D3',
          'sage-dark': '#56664F',
          card: '#FFFCF6',       // Soft Cream
          cardHover: '#FAF6EE',
          text: '#403B35',       // Dark Brown
          muted: '#77736B',      // Muted Gray
          border: '#E4DACA',     // Light Beige
          'border-focus': '#829675',
          accent: '#C59B7E',     // Gentle warm earth
          highlight: '#E8DFCE',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(64, 59, 53, 0.04), 0 1px 2px rgba(64, 59, 53, 0.02)',
        'soft': '0 4px 14px 0 rgba(64, 59, 53, 0.06), 0 1px 3px rgba(64, 59, 53, 0.04)',
        'soft-md': '0 10px 25px -5px rgba(64, 59, 53, 0.08), 0 8px 10px -6px rgba(64, 59, 53, 0.04)',
        'soft-lg': '0 20px 30px -10px rgba(64, 59, 53, 0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
