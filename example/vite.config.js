import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
import pkg from 'vite-plugin-restart'
const VitePluginRestart = pkg.default

const production = process.env.NODE_ENV === 'production'

export default defineConfig({
    server: {
        open: true,
    },
    clearScreen: false,
    plugins: [
        VitePluginRestart({ restart: ['../lib/**/*'] }),
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
