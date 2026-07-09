import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#1b1e25',
          surface: '#eaecef',
          accent: '#e41827',
          white: '#ffffff',
          black: '#000000',
          gray: '#353a45',
        },
      },
      fontFamily: {
        display: ['Oswald', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        'scoreboard-in': {
          '0%': { opacity: '0', transform: 'translateY(14px) rotateX(-10deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotateX(0)' },
        },
        'shimmer-sweep': {
          '0%': { backgroundPosition: '-150% 0' },
          '100%': { backgroundPosition: '150% 0' },
        },
      },
      animation: {
        'scoreboard-in': 'scoreboard-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards',
        'shimmer-sweep': 'shimmer-sweep 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
