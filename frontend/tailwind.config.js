// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: "#1F1E24", 50: "#2A2932", 100: "#353442" },
        carrot: "#FF8A3D",
        avocado: "#62C370",
        strawberry: "#E63946",
        banana: "#F6C453",
        brand: { DEFAULT: "#4E46E5", light: "#6C66F0" },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brandblue: "#002D72",
        brandgradient: {
          from: "#68ACE5",
          to: "#4A90E2",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl2: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 8px 22px rgba(0,0,0,0.25)",
        soft: "0 6px 18px rgba(0,0,0,0.18)",
      },
      transitionTimingFunction: {
        tasty: "cubic-bezier(.22,1,.36,1)",
      },
    },
  },
  plugins: [],
};
