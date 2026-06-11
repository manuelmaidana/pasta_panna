/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0d0d0d',
          surface: '#161616',
          elevated: '#1e1e1e',
          muted: '#2a2a2a',
        },
        accent: {
          DEFAULT: '#e07355',
          light: '#e8896e',
          dark: '#c05c40',
          muted: 'rgba(224,115,85,0.12)',
        },
        text: {
          primary: '#f2ede8',
          secondary: '#a09890',
          muted: '#5a534e',
        },
        border: {
          subtle: 'rgba(242,237,232,0.06)',
          DEFAULT: 'rgba(242,237,232,0.10)',
          strong: 'rgba(242,237,232,0.18)',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-accent': '0 0 40px rgba(224,115,85,0.15)',
        card: '0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
        'card-hover': '0 1px 3px rgba(0,0,0,0.5), 0 16px 40px rgba(0,0,0,0.4)',
        'inset-top': 'inset 0 1px 1px rgba(255,255,255,0.05)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.32, 0.72, 0, 1)',
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
