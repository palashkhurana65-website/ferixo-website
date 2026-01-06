import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ferixo: {
          main: "#0A1A2F",       // Deep Navy
          secondary: "#C9D1D9", 
          surface: "#133159",  
          white: "#F8F8F8",     // Pure White (Highlights)
             // Slightly lighter navy for cards
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      // Apple-level easing curve
      transitionTimingFunction: {
        'ferixo-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
export default config;