export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(15, 23, 42, 0.07), 0 10px 25px -5px rgba(15, 23, 42, 0.06)',
        card: '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 12px 28px -8px rgba(79, 70, 229, 0.12)'
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease-out forwards',
        shimmer: 'shimmer 1.2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: []
};
