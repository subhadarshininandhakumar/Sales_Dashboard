/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0F1A',
          soft: '#0E1524',
        },
        surface: {
          DEFAULT: '#111A2C',
          raised: '#16213A',
          line: '#22304A',
        },
        text: {
          DEFAULT: '#E8ECF4',
          muted: '#7C8AA5',
          faint: '#4B5872',
        },
        signal: {
          up: '#33D6A6',
          down: '#FF6B6B',
          warn: '#F5B942',
          accent: '#5B8CFF',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
