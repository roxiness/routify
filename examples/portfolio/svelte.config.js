import routify from '@roxi/routify/vite-plugin'
import indexByName from '@roxi/routify/plugins/indexByName.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // hydrate the <div id="svelte"> element in src/app.html
        target: '#svelte',

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
