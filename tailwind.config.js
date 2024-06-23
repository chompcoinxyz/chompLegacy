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
        primary: "#F98140",
        secondary: "#F9FCFF",
        accent: "#C4D3E3",
        accent2: "#BACCDF",
        bgMain: '#202037',
        darkMain: "#1E1E1E",
        btnDisabled: '#31313B',
        btnGray: '#A5B8CC',
        withdrawGray: '#595959',
        dark: '#151520',
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
      }
    },
  },
  plugins: [],
}