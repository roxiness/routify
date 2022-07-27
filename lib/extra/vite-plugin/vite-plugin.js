import { RoutifyBuildtime } from '../../buildtime/RoutifyBuildtime.js'
import fse from 'fs-extra'
import 'url'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { getSpank, stripLogs } from './utils.js'

const isProduction = process.env.NODE_ENV === 'production'
const __dirname = fileURLToPath(dirname(import.meta.url))

// not sure why Vite/Kit runs buildStart multiple times
let buildCount = 0
let isSsr = false

/**
 * @typedef {Object} VitePluginOptions
 * @prop {Boolean} run Run Routify
 * @prop {Boolean} forceLogging Force logging in production
 * @prop {Partial<VitePluginOptions_SSR>} ssr SSR options
 */

/**
 * @typedef {Object} VitePluginOptions_SSR
 * @prop {"cjs"|"esm"} type
 * @prop {boolean=} [prerender=true] Prerender pages into dist/client
 * @prop {any} spank Options to use with spank when prerendering
 */

/**
 * @param {Partial<RoutifyBuildtimeOptions & VitePluginOptions>=} options
 * @returns
 */
export default function RoutifyPlugin(options = {}) {
    options.watch = options.watch ?? !isProduction
    options.run = options.run ?? true
    options.ssr = options.ssr ?? {}
    options.ssr.type = options.ssr.type || 'esm'
    options.ssr.prerender = options.ssr.prerender ?? true

    return {
        name: 'routify-plugin',

        buildStart: async () => {
            if (options.run && !buildCount++) {
                const routify = new RoutifyBuildtime(options)
                await routify.start()
            }
            return null
        },

        config: cfg => {
            isSsr = cfg.build?.ssr
            return {
                server: {
                    fs: {
                        strict: false,
                        allow: ['./.routify'],
                    },
                },
                build: {
                    ssr: cfg.build?.ssr === true ? 'src/App.svelte' : cfg.build?.ssr,
                    outDir: cfg.build?.ssr ? 'dist/server' : 'dist/client',
                    polyfillDynamicImport: false,
                },
            }
        },

        closeBundle: async () => {
            if (!isSsr) return

            const type = options.ssr.type

            fse.copySync(__dirname + `/assets/${type}Renderer.js`, 'dist/server/serve.js')

            if (type === 'cjs') fse.writeFileSync('dist/server/package.json', '{}')

            fse.copySync('dist/client/index.html', 'dist/server/index.html', {
                overwrite: true,
            })

            if (options.ssr.prerender) {
                const spank = await getSpank()
                await spank.start(options.ssr.spank)
            }
        },

        transform: (str, id) =>
            isProduction && !options.forceLogging && stripLogs(id, str),
    }
}
