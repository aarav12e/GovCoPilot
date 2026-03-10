export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080c14', surface: '#0d1321', card: '#111827', card2: '#141e2e',
        border1: '#1d2b45', border2: '#243450',
        saffron: '#ff9933', saffron2: '#ffb347',
        govgreen: '#138808', green2: '#1aab0a',
        text1: '#e2e8f8', text2: '#94a3c8', text3: '#4a5878',
      },
      fontFamily: {
        display: ['Cabinet Grotesk', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
        serif: ['Instrument Serif', 'serif'],
      },
    },
  },
  plugins: [],
}
