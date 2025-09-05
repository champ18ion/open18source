// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A", // deep black
        surface: "#111111",    // slightly lighter for cards
        border: "#1E1E1E",     // subtle borders
        text: {
          primary: "#FFFFFF",
          secondary: "#A1A1A1",
          muted: "#6B6B6B",
        },
        accent: "#E27655",     // our rare highlight color
      },
      fontFamily: {
        sans: ["Satoshi", "Clash Grotesk", "Chillax", "sans-serif"],
      },
    },
  },
};
