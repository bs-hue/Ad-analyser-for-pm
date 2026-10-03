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
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: '#d3dbd3',
        surface: {
          DEFAULT: '#fbfcfb',
          dock: '#141517',
          card: '#f0f3f0',
          border: '#e2e7e2',
        },
        lime: {
          DEFAULT: '#e2f976',
          hover: '#d8f45a',
          light: '#f4ffd4',
        },
        charcoal: {
          DEFAULT: '#121316',
          secondary: '#1c1e22',
          muted: '#626863',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
