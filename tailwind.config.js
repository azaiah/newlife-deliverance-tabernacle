/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // New Life Deliverance Tabernacle: royal purple, anointing gold, ivory
        midnight: { DEFAULT: '#1A0F2B', 2: '#2A1844' },
        plum: { DEFAULT: '#3A1F5E', 2: '#4B2A7B' },
        amethyst: '#6E44A8',
        linen: '#FAF6EE',
        parchment: '#F2EBDD',
        paper: '#FFFFFF',
        gold: { DEFAULT: '#8A6620', bright: '#C9A24B', light: '#E2C072', 50: '#F7EEDA' },
        royal: { DEFAULT: '#4B2A7B', 50: '#F2ECF9' },
        slate: '#5E566A',
        line: '#E7DFD0',
        success: '#1E7A4C',
        warning: '#B7791F',
        danger: '#B42318',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        caps: ['Cinzel', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,15,43,0.06), 0 4px 18px rgba(26,15,43,0.07)',
        lift: '0 8px 30px rgba(26,15,43,0.18)',
      },
      keyframes: {
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        rays: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        drift: { '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' }, '50%': { transform: 'translate3d(3%,-2%,0) scale(1.08)' } },
        floatUp: { '0%': { transform: 'translateY(0)', opacity: '0' }, '10%': { opacity: '1' }, '100%': { transform: 'translateY(-120vh)', opacity: '0' } },
        glint: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        pulseDot: 'pulseDot 1.2s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        rays: 'rays 90s linear infinite',
        drift: 'drift 18s ease-in-out infinite',
        glint: 'glint 6s linear infinite',
      },
    },
  },
  plugins: [],
}
