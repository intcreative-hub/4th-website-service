import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NEW: Sophisticated Color Palette - BRIGHTER
        'primary-purple': '#8b5cf6',  // Brighter purple
        'primary-emerald': '#10b981',  // Brighter emerald
        'accent-purple': '#8b5cf6',
        'accent-emerald': '#14b8a6',

        // Dark Backgrounds
        'dark-bg': '#0f172a',
        'darker-bg': '#0a0f1a',
        'card-bg': '#1a2844',

        // Neutrals - BRIGHTER for better contrast
        'neutral-200': '#f3f4f6',  // Much lighter
        'neutral-600': '#9ca3af',  // Lighter gray

        // Accents - BRIGHTER
        'cream': '#fef9f3',  // Very light cream
        'charcoal': '#1a1a1a',

        // Legacy support (for gradual migration)
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
        },
        emerald: {
          DEFAULT: '#14b8a6', // Updated to accent-emerald
          light: '#34d399',
          dark: '#059669',
        },
        purple: {
          DEFAULT: '#8b5cf6', // Updated to accent-purple
          light: '#c084fc',
          dark: '#9333ea',
        },
        light: {
          cream: '#f9f9f7',
          soft: '#edeae0',
          text: '#f1f5f9',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
