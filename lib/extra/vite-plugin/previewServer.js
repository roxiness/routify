// todo issues caused by race conditions by simultaneous calls? Needs scoped instances for server response

/**
 * @param {*} server
 * @param {Partial<VitePluginOptions>} options
 * @returns
 */
export const previewServer = (server, options) => () => {
    server.middlewares.use(async (req, res, next) => {
        const compositeUrl = req.originalUrl

        if (compositeUrl.endsWith('.ico')) return

        console.log('[Routify previewServer] serving:', compositeUrl)

        const path = 'file:///' + process.cwd() + '/dist/server/serve.js'

        if (globalThis.__routify) {
            globalThis.__routify.instances[0].routers.length = 0
        }
        const { render } = await import(`${path}?url=${compositeUrl}`)

        const output = await render(compositeUrl)

        res.setHeader('Content-Type', 'text/html')
        res.statusCode = output.load?.status || 200
        res.end(output.html)
    })
}
