import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        studio: {
          black: "#050608",
          ink: "#090A0F",
          panel: "rgba(255,255,255,0.06)",
          line: "rgba(255,255,255,0.10)",
          cyan: "#66E4FF",
          violet: "#9D7BFF",
          blue: "#6CA8FF",
          success: "#68E3A3",
          warning: "#F8C66A",
          danger: "#FF6B8B"
        }
      },
      boxShadow: {
        glow: "0 0 60px rgba(102, 228, 255, 0.16)",
        glass: "0 18px 60px rgba(0,0,0,0.35)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
