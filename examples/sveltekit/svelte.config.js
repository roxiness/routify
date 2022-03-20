import routify from '@roxi/routify/vite-plugin'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        vite: {
            plugins: [routify({ routesDir: 'src/pages' })],
            resolve: {
                dedupe: ['svelte'],
            },
        },
    },
}

export default config
