import { svelte } from '@sveltejs/vite-plugin-svelte'
import routify from '@roxi/routify/vite-plugin'
import { defineConfig } from 'vite'

const production = process.env.NODE_ENV === 'production'

export default defineConfig({
    resolve: { conditions: ['browser'] },
    clearScreen: false,
    plugins: [
        routify({
            render: {
                ssg: !!production,
                ssr: !!production,
            },
        }),
        svelte({
            compilerOptions: {
                dev: !production,
            },
        }),
    ],

    server: { port: 1337 },
})
