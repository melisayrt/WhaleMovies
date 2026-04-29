/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#2ea043',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        surface: {
          base: '#0d1117',
          card: '#161b22',
          elevated: '#21262d',
          border: '#30363d',
          muted: '#484f58',
        },
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.4s ease forwards',
        'fadeIn': 'fadeIn 0.3s ease forwards',
        'scaleIn': 'scaleIn 0.2s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      backgroundImage: {
        'cinema-gradient': 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)',
        'card-gradient': 'linear-gradient(145deg, #161b22, #0d1117)',
      },
      boxShadow: {
        'green-glow': '0 0 20px rgba(46, 160, 67, 0.15)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'modal': '0 24px 64px rgba(0, 0, 0, 0.6)',
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
};