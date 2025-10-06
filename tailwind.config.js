/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./views/**/*.{ejs,html}",
        // "./public/**/*.{js,html}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#0f172a',
                    surface: '#1e293b',
                    card: '#334155',
                    text: '#f1f5f9',
                    muted: '#94a3b8'
                }
            },
        },
    },
    plugins: [
    ],
};