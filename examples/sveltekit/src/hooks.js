import { createRouter } from '@roxi/routify'
import routes from '../.routify/routes.default'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, loader }) {
    const ssrNode = await loader.loadComponent({ id: '.rtf/Root.svelte' });
    // const load = await ssrNode.module.load()
    const router = createRouter({ routes })
    await router.url.replace(request.path)

    // const ssrNode = await loader.loadComponent({ id: 'src/routes/root.svelte' });
    const rendered = ssrNode.module.default.render({ router, foo: 'bar' });
    const externalResources = [
        ...Array.from(ssrNode.js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
        ...Array.from(ssrNode.css).map((dep) => `<link rel="stylesheet" href="${dep}">`)
    ].join('\n\t\t');
    const styles = `<style>${ssrNode.styles.join('\n')}</style>`
    const html = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <link rel="icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ${externalResources}
        ${styles}
        ${rendered.head}
    </head>
    <body>
        <div id="svelte">${rendered.html}</div>
    </body>
</html>
`;
    return {
        status: 200,
        body: html,
        headers: {
            'content-type': 'text/html'
        }
    }
}