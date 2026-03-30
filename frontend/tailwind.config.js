/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush:    '#FFB6C1',
        blushL:   '#FFE4EA',
        lavender: '#E6CFFF',
        lavL:     '#F3EAFF',
        cream:    '#FFF8F0',
        sage:     '#B5CDA3',
        sageD:    '#8aab78',
        rose:     '#C9848A',
        roseD:    '#a86870',
        roseDD:   '#8a5560',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins:  ['Poppins', 'sans-serif'],
        dancing:  ['"Dancing Script"', 'cursive'],
      },
      borderRadius: {
        'sm': '12px',
        'md': '18px',
        'lg': '28px',
        'xl': '40px',
      },
      boxShadow: {
        'soft-s': '0 2px 12px rgba(201,132,138,.12)',
        'soft-m': '0 6px 28px rgba(201,132,138,.18)',
        'soft-l': '0 12px 48px rgba(201,132,138,.24)',
      },
    },
  },
  plugins: [],
};
