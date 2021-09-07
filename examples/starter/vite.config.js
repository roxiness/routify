import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'
import routify from '@roxi/routify/vite-plugin'

const production = process.env.NODE_ENV === 'production'

export default defineConfig({
    clearScreen: false,
    plugins: [
        routify(),
        svelte({
            emitCss: true,
            compilerOptions: {
                dev: !production,
            },
            extensions: ['.md', '.svelte'],
            preprocess: [mdsvex({ extension: 'md' })],
        }),
    ],
    server: { port: 1337 },
    resolve: {
        alias: {
            '#cmp': process.cwd() + '/src/components',
        },
    },
})
