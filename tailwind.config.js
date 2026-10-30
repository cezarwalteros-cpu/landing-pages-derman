/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: {
          50: '#effaf6',
          100: '#d8f3e8',
          200: '#b3e6d3',
          500: '#16a37a',
          600: '#0e8a66',
          700: '#0b6e52',
          900: '#073b2d',
        },
        ink: '#0f1f1a',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(22,163,122,0.55)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 0 0 12px rgba(22,163,122,0)' },
        },
      },
      animation: { pulseGlow: 'pulseGlow 1.8s ease-in-out infinite' },
    },
  },
  plugins: [],
};
