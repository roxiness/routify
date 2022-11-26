import { RoutifyBuildtime } from '../../buildtime/RoutifyBuildtime.js'
import { postSsrBuildProcess, stripLogs } from './utils.js'
import { devServer } from './devServer.js'
import { previewServer } from './previewServer.js'
import { build } from 'vite'

const isProduction = process.env.NODE_ENV === 'production'

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
    options.ssr.enable =
        options.ssr.enable ?? JSON.parse(process.env.ROUTIFY_SSR_ENABLE ?? 'false')

    process.env.ROUTIFY_SSR_ENABLE = JSON.stringify(options.ssr.enable)

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
            if (isSsr) {
                cfg.ssr.noExternal = true
                cfg.ssr.target = 'webworker'
            }
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
                },
                envPrefix: ['VITE_', 'ROUTIFY_SSR_ENABLE'],
            }
        },
        configureServer: options.ssr.enable && (server => devServer(server, options)),
        configurePreviewServer:
            options.ssr.enable && (server => previewServer(server, options)),
        closeBundle: async () => {
            if (!options.ssr.enable) return
            else if (!isSsr) await build({ build: { ssr: true } })
            else await postSsrBuildProcess(options)
        },

        transform: (str, id) =>
            isProduction && !options.forceLogging && stripLogs(id, str),
    }
}
