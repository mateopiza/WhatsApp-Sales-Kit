/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5EDE6',
          light: '#FAF5F0',
          dark: '#E8DDD3',
          50: '#FAF6F2',
          100: '#F5EDE6',
          200: '#EFE3D8',
          300: '#E5D5C6',
        },
        taupe: {
          DEFAULT: '#8A8176',
          light: '#A59D93',
          dark: '#6F675D',
          contrast: '#5A524A',
          muted: 'rgba(138, 129, 118, 0.75)',
        },
        stone: {
          DEFAULT: '#CFC7BE',
          light: '#DDD7CF',
          dark: '#BDB3A7',
        },
        gold: {
          DEFAULT: '#D4B48C',
          light: '#E2C8A8',
          dark: '#7D5F30',
          legacy: '#C49F70',
        },
        ink: {
          DEFAULT: '#3A332D',
          light: '#4F4740',
          dark: '#27221E',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#EFE6DE',
        },
        status: {
          success: '#6E7F5C',
          error: '#9C5342',
        }
      },
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        serif: ['"Cinzel"', 'serif'],
        body: ['"Montserrat"', 'sans-serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
      letterSpacing: {
        wide: '0.14em',
        wider: '0.22em',
        widest: '0.28em',
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 4vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '0.14em' }],
        'display-lg': ['2.5rem', { lineHeight: '1.15', letterSpacing: '0.14em' }],
        'display-md': ['1.75rem', { lineHeight: '1.2', letterSpacing: '0.12em' }],
        'display-sm': ['1.25rem', { lineHeight: '1.3', letterSpacing: '0.10em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '8px',
        pill: '999px',
      },
      boxShadow: {
        'sm': '0 1px 4px rgba(58, 51, 45, 0.08)',
        'md': '0 6px 20px rgba(58, 51, 45, 0.10)',
        'lg': '0 16px 40px rgba(58, 51, 45, 0.13)',
        'xl': '0 24px 60px rgba(58, 51, 45, 0.16)',
        'luxury-sm': '0 1px 3px rgba(58, 51, 45, 0.06), 0 1px 2px rgba(58, 51, 45, 0.04)',
        'luxury-card': '0 4px 14px -2px rgba(58, 51, 45, 0.07), 0 2px 5px rgba(58, 51, 45, 0.04)',
        'luxury-hover': '0 14px 36px -4px rgba(58, 51, 45, 0.14), 0 5px 14px rgba(58, 51, 45, 0.07)',
        'luxury-gold': '0 0 0 1px rgba(212,180,140,0.35), 0 8px 24px rgba(58,51,45,0.12)',
        'luxury-modal': '0 32px 64px -12px rgba(58, 51, 45, 0.28), 0 12px 32px rgba(58, 51, 45, 0.10)',
        'luxury-drawer': '0 -10px 40px rgba(58, 51, 45, 0.18)',
        'glow-gold': '0 0 20px rgba(212,180,140,0.30), 0 0 60px rgba(212,180,140,0.10)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'tactile': 'cubic-bezier(0.34, 1.25, 0.64, 1)',
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '400ms',
      },
      aspectRatio: {
        'portrait': '4/5',
        'editorial': '3/4',
        'tall': '9/16',
      },
      animation: {
        'fade-in': 'fadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-down': 'fadeDown 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 400ms cubic-bezier(0.34, 1.26, 0.64, 1) forwards',
        'slide-up': 'slideUp 350ms cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slide-down': 'slideDown 350ms cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slide-left': 'slideInLeft 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right': 'slideInRight 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmerLine 2s infinite linear',
        'heart-pulse': 'heartPulse 300ms cubic-bezier(0.34, 1.26, 0.64, 1) forwards',
        'modal-enter': 'modalEnter 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up-luxury': 'slideUpLuxury 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'ken-burns': 'kenBurns 20s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'bounce-y': 'bounceY 1.8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmerLine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1.08) translate(0, 0)' },
          '50%': { transform: 'scale(1.12) translate(-1%, -0.5%)' },
          '100%': { transform: 'scale(1.08) translate(0, 0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.015)' },
        },
        bounceY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(5px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,180,140,0)' },
          '50%': { boxShadow: '0 0 16px 4px rgba(212,180,140,0.35)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) rotate(1deg)' },
          '66%': { transform: 'translateY(-4px) rotate(-1deg)' },
        },
        heartPulse: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.22)' },
          '70%': { transform: 'scale(0.98) translateY(8px)' },
          '100%': { transform: 'scale(1)' },
        },
        modalEnter: {
          '0%': { opacity: '0', transform: 'scale(0.97) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        slideUpLuxury: {
          '0%': { transform: 'translateY(100%)', opacity: '0.5' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
