/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}" // Catches App.tsx, index.tsx, etc. in root
    ],
    theme: {
        extend: {
            animation: {
                'pulse-border': 'pulse-border 1.5s infinite ease-in-out',
                'breathe-glow': 'breathe-glow 3s infinite ease-in-out',
            },
            keyframes: {
                'pulse-border': {
                    '0%, 100%': { borderColor: '#f87171' },
                    '50%': { borderColor: '#b91c1c' },
                },
                'breathe-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 40px rgba(220, 38, 38, 0.4)',
                        transform: 'scale(1)',
                    },
                    '50%': {
                        boxShadow: '0 0 80px rgba(220, 38, 38, 0.8)',
                        transform: 'scale(1.02)',
                    },
                },
            },
        },
    },
    plugins: [],
}
