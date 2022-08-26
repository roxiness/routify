import fse from 'fs-extra'

/**
 *
 * @param {*} server
 * @param {Partial<VitePluginOptions>} options
 * @returns
 */
export const devServer = (server, options) => () =>
    server.middlewares.use(async (req, res, next) => {
        try {
            const routifyDir = options.routifyDir || '.routify'

            const compositeUrl = req.originalUrl

            if (compositeUrl.endsWith('.ico')) return
            console.log('[Routify devServer] serving:', compositeUrl)

            let template = fse.readFileSync('index.html', 'utf-8')
            template = await server.transformIndexHtml(compositeUrl, template)

            const { render } = await server.ssrLoadModule(`${routifyDir}/render.js`)

            const output = await render(compositeUrl)
            const html = template
                .replace('<!--ssr:html-->', output.html)
                .replace('<!--ssr:head-->', output.head)
                .replace('<!--ssr:css-->', '<style>' + output.css.code + '</style>')

            res.setHeader('Content-Type', 'text/html')

            res.statusCode = output.load?.status || 200
            res.end(html)
        } catch (e) {
            server.ssrFixStacktrace(e)
            next(e)
        }
    })
