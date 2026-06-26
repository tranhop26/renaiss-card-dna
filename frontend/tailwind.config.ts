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
        paper: {
          light: '#FBF7EF',
          DEFAULT: '#F6F1E8',
          dark: '#E2D9C8',
        },
        amber: {
          light: '#F0E3D0',
          DEFAULT: '#C8853F',
          dark: '#A86B2C',
        },
        ink: '#1F2421',
        muted: '#8A8A80',
        charcoal: '#2A2723',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['DM Serif Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
