/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/app/(frontend)/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                body: ['Lora', 'serif'],
                masthead: ['Forum', 'serif'],
            },
            colors: {
                paper: '#fcfaf5',
                ink: '#121212',
                'uni-red': '#8b0000',
                'uni-gold': '#d4af37',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            },
            animation: {
                marquee: 'marquee 30s linear infinite',
            }
        },
    },
    plugins: [],
}
