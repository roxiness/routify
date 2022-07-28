import fs from 'fs'
import express from 'express'
import { createServer as createViteServer } from 'vite'

export const defaults = {
    port: 1337,
    template: 'index.html',
    entrypoint: '/src/App.svelte',
}

/**
 *
 * @param {Partial<defaults>} options
 */
export async function createServer(options = {}) {
    options = { ...defaults, ...options }

    const app = express()

    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
    })

    // use vite's connect instance as middleware
    // if you use your own express router (express.Router()), you should use router.use
    app.use(vite.middlewares)

    app.use('*', async (req, res, next) => {
        const url = req.originalUrl

        try {
            // 1. Read index.html
            let template = fs.readFileSync(options.template, 'utf-8')

            // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
            //    also applies HTML transforms from Vite plugins, e.g. global preambles
            //    from @vitejs/plugin-react
            template = await vite.transformIndexHtml(url, template)

            // 3. Load the server entry. vite.ssrLoadModule automatically transforms
            //    your ESM source code to be usable in Node.js! There is no bundling
            //    required, and provides efficient invalidation similar to HMR.
            const { load, default: app } = await vite.ssrLoadModule(options.entrypoint)

            await load(url)

            // 4. render the app HTML. This assumes entry-server.js's exported `render`
            //    function calls appropriate framework SSR APIs,
            //    e.g. ReactDOMServer.renderToString()
            const output = app.render()

            // 5. Inject the app-rendered HTML into the template.
            const html = template
                .replace('<!--ssr:html-->', output.html)
                .replace('<!--ssr:head-->', output.head)
                .replace('<!--ssr:css-->', output.css.code)

            // 6. Send the rendered HTML back.
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            // If an error is caught, let Vite fix the stack trace so it maps back to
            // your actual source code.
            vite.ssrFixStacktrace(e)
            next(e)
        }
    })

    app.listen(options.port)
    console.log(`[Routify 3] Listening on http://127.0.0.1:${options.port}`)
}
