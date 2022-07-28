import fse from 'fs-extra'

export const devServer = server => () =>
    server.middlewares.use(async (req, res, next) => {
        try {
            const url = req.originalUrl
            let template = fse.readFileSync('index.html', 'utf-8')
            template = await server.transformIndexHtml(url, template)

            // import App.svelte
            const { load, default: app } = await server.ssrLoadModule('src/App.svelte')

            // run all loads, guards, fetches etc
            const routifyResponse = load && (await load(url))

            // render the Svelte app
            const output = app.render()

            const html = template
                .replace('<!--ssr:html-->', output.html)
                .replace('<!--ssr:head-->', output.head)
                .replace('<!--ssr:css-->', output.css.code)

            res.setHeader('Content-Type', 'text/html')
            res.statusCode = routifyResponse?.status || 200
            res.end(html)
        } catch (e) {
            server.ssrFixStacktrace(e)
            next(e)
        }
    })
