import { svelte } from '@sveltejs/vite-plugin-svelte'
import routify from '@roxi/routify/vite-plugin'
import { defineConfig } from 'vite'
import { mdsvex } from 'mdsvex'

const production = process.env.NODE_ENV === 'production'

export default defineConfig({
    clearScreen: false,
    plugins: [
        routify({
            devHelper: !production,
            // SSR defaults
            // ssr: {
            //     type: 'esm',
            //     prerender: true,
            //     spank: { sitemap: ['/'] },
            // },
        }),
        svelte({
            emitCss: false,
            compilerOptions: {
                hydratable: true,
                dev: !production,
            },
            extensions: ['.md', '.svelte'],
            preprocess: [mdsvex({ extension: 'md' })],
        }),
    ],

    server: { port: 1337 },
})
