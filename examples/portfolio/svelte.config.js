import routify from '@roxi/routify/vite-plugin'
import indexByName from '@roxi/routify/plugins/indexByName.js'
import vercel from '@sveltejs/adapter-vercel'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // hydrate the <div id="svelte"> element in src/app.html
        target: '#svelte',
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
        router: false,
    },
}

export default config
