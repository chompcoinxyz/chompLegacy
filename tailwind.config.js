/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFCB3C",
        secondary: "#F9FCFF",
        orange: "#FD823D",
        bgMain: '#0A0940',
        darkMain: "#1E1E1E",
        // darkMain: "#0A0940",
        btnDisabled: '#31313B',
        btnGray: '#A5B8CC',
        withdrawGray: '#595959',
        dark: '#151520',
        textGray: "#A2A2A2",
      },
      fontFamily: {
        // 'sans': ['Lato', 'sans-serif'], 
        'poppins': ['Poppins', 'sans-serif'],
        'amiger': ['Amiger', 'sans-serif'],
      },
      fontWeight: {
        'normal': 400,
        'medium': 500,
        'semibold': 700,
      },
      opacity: {
        '99': '.9999',
      },
      zIndex: {
        '1000': '1000',
      }
    },
  },
  plugins: [],
}