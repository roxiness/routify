/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.svelte', './src/**/*.css', './index.html'],
    theme: {
        extend: {},
    },
    plugins: [require('tailwindcss-debug-screens')],
};
