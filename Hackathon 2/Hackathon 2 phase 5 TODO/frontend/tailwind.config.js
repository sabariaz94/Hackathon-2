/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        // Primary purple color system
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',  // Main accent
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Dark theme surface colors
        surface: {
          DEFAULT: '#18181b',  // zinc-900
          dark: '#000000',     // Pure black background
          light: '#27272a',    // zinc-800 for borders
        },
        // Obsidian theme colors (for compatibility)
        obsidian: {
          black: '#000000',
          gray: {
            700: '#27272a',
            800: '#18181b',
            900: '#0a0a0a',
          },
          violet: {
            primary: '#7c3aed',
            dark: '#6b21a8',
            light: '#a78bfa',
            glow: '#8b5cf6',
          },
          danger: '#ef4444',
          success: '#22c55e',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'gradient': 'gradient 20s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
