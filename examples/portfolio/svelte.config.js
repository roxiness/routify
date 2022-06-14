import routify from '@roxi/routify/vite-plugin'
import indexByName from '@roxi/routify/plugins/indexByName.js'
import vercel from '@sveltejs/adapter-vercel'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: vercel(),

        vite: {
            plugins: [
                routify({
                    plugins: [indexByName()],
                }),
            ],
            resolve: {
                dedupe: ['svelte'],
            },
        },
        browser: {
            router: false,
        },
    },
}

export default config
