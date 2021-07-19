/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // hydrate the <div id="svelte"> element in src/app.html
        target: '#svelte',
        vite: {
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
