import { svelte } from '@sveltejs/vite-plugin-svelte'
import routify from '@roxi/routify/vite-plugin'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
    clearScreen: false,
    resolve: { alias: { '@': resolve('src') } },
    plugins: [
        routify({
            render: {
                ssg: mode === 'production',
                ssr: mode === 'production',
            },
        }),
        svelte({
            compilerOptions: {
                dev: mode === 'development',
            },
        }),
    ],

    server: { port: 1337 },
}))
