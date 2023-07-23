import { devServer as RoutifyServer } from '../vite-plugin/devServer.js'
import { createDirname, relativeUnix } from '../../buildtime/utils.js'
import fs from 'fs'

const __dirname = createDirname(import.meta)

/**
 * @typedef {Object} Options
 * @prop {import('vite').InlineConfig} [viteServerConfig] Vite config
 */

/**
 * Creates a Routify express plugin for development
 * @param {function} createViteServer
 * @param {Options} options
 */
export const routifyViteSsr = async (createViteServer, options = {}) => {
    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
        ...options.viteServerConfig,
    })

    RoutifyServer(vite, {})()

    // Use vite's connect instance as middleware. If you use your own
    // express router (express.Router()), you should use router.use
    return vite.middlewares
}

/**
 * Creates a Routify express plugin for production
 * @param {string} pathToSSRScript path to the SSR script
 */
export const routifyProdSsr = async (pathToSSRScript = 'dist/server/serve.js') => {
    // else serve the built version
    const ssrScript = relativeUnix(__dirname, pathToSSRScript)

    // console.log the age in seconds of the pathToSSRScript file
    const { birthtimeMs } = fs.statSync(pathToSSRScript)
    const age = Math.round((Date.now() - birthtimeMs) / 1000)
    console.log(`[Routify] using ${pathToSSRScript} built ${age}s ago`)

    return async (req, res, next) => {
        const { render } = await import(ssrScript)
        const appHtml = await render(req.originalUrl)
        res.status(appHtml.status).send(appHtml.html)
        next()
    }
}
