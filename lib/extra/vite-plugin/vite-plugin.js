import { RoutifyBuildtime } from '../../buildtime/RoutifyBuildtime.js'
import fse from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { getSpank, stripLogs } from './utils.js'
import { devServer } from './devServer.js'
import { previewServer } from './previewServer.js'
import { build } from 'vite'

const isProduction = process.env.NODE_ENV === 'production'
const __dirname = fileURLToPath(dirname(import.meta.url))

// not sure why Vite/Kit runs buildStart multiple times
let buildCount = 0
let isSsr = false

/**
 * @param {Partial<VitePluginOptions>=} options
 * @returns {import('vite').PluginOption}
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
            isSsr = !!cfg.build?.ssr
            return {
                appType: cfg.appType || (options.ssr.enable ? 'custom' : undefined),
                server: {
                    fs: {
                        strict: false,
                        allow: ['./.routify'],
                    },
                },
                build: {
                    ssr: cfg.build?.ssr === true ? '.routify/render.js' : cfg.build?.ssr,
                    outDir:
                        cfg.build?.outDir ||
                        (cfg.build?.ssr ? 'dist/server' : 'dist/client'),
                    polyfillDynamicImport: false,
                },
            }
        },
        configureServer: options.ssr.enable && (server => devServer(server, options)),
        configurePreviewServer:
            options.ssr.enable && (server => previewServer(server, options)),
        closeBundle: async () => {
            if (!options.ssr.enable) return
            else if (!isSsr) await build({ build: { ssr: true } })
            else {
                const type = options.ssr.type
                fse.copySync(
                    __dirname + `/assets/${type}Renderer.js`,
                    'dist/server/serve.js',
                )

                if (type === 'cjs') fse.writeFileSync('dist/server/package.json', '{}')

                fse.moveSync('dist/client/index.html', 'dist/server/index.html', {
                    overwrite: true,
                })

                if (options.ssr.prerender) {
                    const spank = await getSpank()
                    await spank.start(options.ssr.spank)
                }
            }
        },

        transform: (str, id) =>
            isProduction && !options.forceLogging && stripLogs(id, str),
    }
}
