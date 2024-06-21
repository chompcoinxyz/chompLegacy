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
        primary: "#007AFF",
        secondary: "#F9FCFF",
        accent: "#C4D3E3",
        accent2: "#BACCDF",
        darkMain: "#1E1E1E",
        btnDisabled: '#E5EEF7',
        btnGray: '#A5B8CC',
        withdrawGray: '#595959',
      },
      fontFamily: {
        'sans': ['Lato', 'sans-serif'] 
      },
    },
  },
  plugins: [],
}