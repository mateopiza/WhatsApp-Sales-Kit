/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Generic neutral + indigo accent palette — replace these hex values with
      // your own brand colors. Class names (bg-cream, text-ink, text-gold-dark,
      // etc.) stay the same across the kit's templates so components are
      // portable; only the values here define what they render as.
      colors: {
        cream: {
          DEFAULT: '#FAFAF9',
          light: '#FFFFFF',
          dark: '#F0F0EE',
          50: '#FFFFFF',
          100: '#FAFAF9',
          200: '#F0F0EE',
          300: '#E4E4E1',
        },
        taupe: {
          DEFAULT: '#8A8580',
          light: '#ABA79F',
          dark: '#57534E',
          contrast: '#44403C',
          muted: 'rgba(138, 133, 128, 0.75)',
        },
        stone: {
          DEFAULT: '#D6D3D1',
          light: '#E7E5E4',
          dark: '#A8A29E',
        },
        gold: {
          DEFAULT: '#818CF8',
          light: '#A5B4FC',
          dark: '#4338CA',
          legacy: '#818CF8',
        },
        ink: {
          DEFAULT: '#111111',
          light: '#27272A',
          dark: '#000000',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F0F0EE',
        },
        status: {
          success: '#16A34A',
          error: '#DC2626',
        }
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        serif: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
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
        'sm': '0 1px 4px rgba(17, 17, 17, 0.08)',
        'md': '0 6px 20px rgba(17, 17, 17, 0.10)',
        'lg': '0 16px 40px rgba(17, 17, 17, 0.13)',
        'xl': '0 24px 60px rgba(17, 17, 17, 0.16)',
        'luxury-sm': '0 1px 3px rgba(17, 17, 17, 0.06), 0 1px 2px rgba(17, 17, 17, 0.04)',
        'luxury-card': '0 4px 14px -2px rgba(17, 17, 17, 0.07), 0 2px 5px rgba(17, 17, 17, 0.04)',
        'luxury-hover': '0 14px 36px -4px rgba(17, 17, 17, 0.14), 0 5px 14px rgba(17, 17, 17, 0.07)',
        'luxury-gold': '0 0 0 1px rgba(129,140,248,0.35), 0 8px 24px rgba(17,17,17,0.12)',
        'luxury-modal': '0 32px 64px -12px rgba(17, 17, 17, 0.28), 0 12px 32px rgba(17, 17, 17, 0.10)',
        'luxury-drawer': '0 -10px 40px rgba(17, 17, 17, 0.18)',
        'glow-gold': '0 0 20px rgba(129,140,248,0.30), 0 0 60px rgba(129,140,248,0.10)',
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(129,140,248,0)' },
          '50%': { boxShadow: '0 0 16px 4px rgba(129,140,248,0.35)' },
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
