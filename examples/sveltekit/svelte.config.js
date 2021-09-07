import routify from '@roxi/routify/lib/extra/vite-plugin.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // hydrate the <div id="svelte"> element in src/app.html
        target: '#svelte',
        vite: {
            plugins: [routify()],
            resolve: {
                dedupe: ['svelte'],
                alias: {
                    '#root': process.cwd() + '/../..',
                    '#lib': process.cwd() + '/../../lib',
                    '#cmp': process.cwd() + '/src/components',
                },
            },
        },
    },
}

export default config
