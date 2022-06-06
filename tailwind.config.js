module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-bunker": "#151e23",
        "custom-dark-gunmetal": "#1f282d",
        "custom-gunmetal": "#2a3137",
        "custom-abbey": "#495154"
      },
      width: {
        "62/100": "62%",
        "38/100": "38%"
      },
      height: {
        128: "8rem"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
