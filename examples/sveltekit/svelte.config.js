import routify from '@roxi/routify/vite-plugin'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // hydrate the <div id="svelte"> element in src/app.html
        target: '#svelte',

        vite: {
            plugins: [routify()],
            resolve: {
                dedupe: ['svelte'],
            },
        },

        router: false
    }
};

export default config
