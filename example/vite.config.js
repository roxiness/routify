import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'

const production = process.env.NODE_ENV === 'production'

export default defineConfig({
    clearScreen: false,
    plugins: [
        svelte({
            emitCss: true,
            compilerOptions: {
                dev: !production,
            },
        }),
    ],
    build: {
        polyfillDynamicImport: false,
        cssCodeSplit: false,
    },
    resolve: {
        dedupe: ['svelte'],
    },
})
