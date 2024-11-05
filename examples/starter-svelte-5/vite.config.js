import { svelte } from '@sveltejs/vite-plugin-svelte'
import routify from '@roxi/routify/vite-plugin'
import { defineConfig } from 'vite'

const production = process.env.NODE_ENV === 'production'

export default defineConfig({
    clearScreen: false,

    plugins: [
        routify({}),
        svelte({
            compilerOptions: {
                dev: !production,
            },
        }),
    ],

    server: { port: 1337 },
})
