/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Couleurs tirées du logo Permanence IA
        ink: { DEFAULT: '#0E1B4D', soft: '#22306A' },
        signal: { DEFAULT: '#0FA3C4', deep: '#0A7690', soft: '#E2F5FA', glow: '#5AD3EC' },
        paper: '#F5F8FB',
        slate: { DEFAULT: '#4A5875', light: '#626E86' },
        line: '#DDE5EE',
        night: { DEFAULT: '#0A1233', raised: '#141E47' },
        ok: '#178256',
        no: '#C8463D',
        // Alias pour les pages héritées (légal, blog)
        navy: { DEFAULT: '#0E1B4D', dark: '#0A1233', light: '#22306A' },
        primary: { DEFAULT: '#0FA3C4', hover: '#0B7F99' },
        accent: { DEFAULT: '#E2F5FA', glow: '#5AD3EC' },
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Échelle typographique (ratio ~1.25)
        hero: ['clamp(2.25rem, 4.2vw, 3.4rem)', { lineHeight: '1.06', letterSpacing: '-0.025em' }],
        h2: ['clamp(1.9rem, 3.4vw, 2.7rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        h3: ['1.3rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(14,27,77,.06), 0 8px 24px -12px rgba(14,27,77,.18)',
        float: '0 24px 60px -24px rgba(14,27,77,.35)',
      },
      maxWidth: { prose: '68ch' },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'none' } },
        pulsering: { '0%': { boxShadow: '0 0 0 0 rgba(15,163,196,.45)' }, '100%': { boxShadow: '0 0 0 14px rgba(15,163,196,0)' } },
        wave: { '0%,100%': { transform: 'scaleY(.35)' }, '50%': { transform: 'scaleY(1)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        // Explorateur de scénarios : la photo du métier se dévoile, puis la carte d’appel glisse en place.
        stage: { from: { opacity: '0', transform: 'scale(1.06)', clipPath: 'inset(0 0 0 18% round 18px)' }, to: { opacity: '1', transform: 'none', clipPath: 'inset(0 0 0 0 round 18px)' } },
        dock: { from: { opacity: '0', transform: 'translateX(24px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        rise: 'rise .45s ease-out both',
        pulsering: 'pulsering 1.8s ease-out infinite',
        wave: 'wave 1.1s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        stage: 'stage .7s cubic-bezier(.2,.7,.2,1) both',
        dock: 'dock .5s cubic-bezier(.2,.7,.2,1) .18s both',
      },
    },
  },
  plugins: [],
};
