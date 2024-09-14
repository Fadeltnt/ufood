/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      width: {
        300: '300px',
        500: '500px',
        '1/24': '4.17%',
      },
    },
  },
  plugins: [require('daisyui')],
}
