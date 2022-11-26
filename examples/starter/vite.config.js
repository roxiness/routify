import { svelte } from '@sveltejs/vite-plugin-svelte'
import routify from '@roxi/routify/vite-plugin'
import { defineConfig } from 'vite'
import { mdsvex } from 'mdsvex'

const production = process.env.NODE_ENV === 'production'

export default defineConfig({
    clearScreen: false,

    plugins: [
        routify({
            ssr: { enable: false },
        }),
        svelte({
            compilerOptions: {
                dev: !production,
                hydratable: !!process.env.ROUTIFY_SSR_ENABLE,
            },
            extensions: ['.md', '.svelte'],
            preprocess: [mdsvex({ extension: 'md' })],
        }),
    ],

    server: { port: 1337 },
})
