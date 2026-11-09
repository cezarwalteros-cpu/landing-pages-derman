/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#dc2626',
          600: '#c51d1d',
          700: '#991b1b',
          900: '#5c0a0f',
        },
        ink: '#1a1212',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(220,38,38,0.55)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 0 0 12px rgba(220,38,38,0)' },
        },
      },
      animation: { pulseGlow: 'pulseGlow 1.8s ease-in-out infinite' },
    },
  },
  plugins: [],
};
