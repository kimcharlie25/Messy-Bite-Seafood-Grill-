/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mb: {
          red: '#da2a1c',
          yellow: '#ffb800',
          black: '#000000',
          white: '#ffffff',
          charcoal: '#1a1a1a',
          'red-dark': '#b82217',
          'red-light': '#ff4433',
          'yellow-light': '#ffd700',
          'yellow-dark': '#e6a600'
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Cormorant Garamond', 'Playfair Display', 'serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'elegant-scale': 'elegantScale 0.4s ease-out',
        'subtle-glow': 'subtleGlow 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        elegantScale: {
          '0%': { transform: 'scale(0.98)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        subtleGlow: {
          '0%, 100%': { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' },
          '50%': { boxShadow: '0 4px 24px rgba(218, 42, 28, 0.08)' }
        }
      },
      letterSpacing: {
        'luxury': '0.05em',
        'wide': '0.1em'
      }
    },
  },
  plugins: [],
};