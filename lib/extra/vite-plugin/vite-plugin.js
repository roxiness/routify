import { RoutifyBuildtime } from '../../buildtime/RoutifyBuildtime.js'
import {
    normalizeOptions,
    optionsCheck,
    postSsrBuildProcess,
    stripLogs,
} from './utils.js'
import { devServer } from './devServer.js'
import { previewServer } from './previewServer.js'
import { build } from 'vite'
import './typedef.js'
const isProduction = process.env.NODE_ENV === 'production'

// not sure why Vite/Kit runs buildStart multiple times
let buildCount = 0
let isSsr = false

/**
 * @param {Partial<VitePluginOptionsInput>=} input
 */
export default function RoutifyPlugin(input = {}) {
    const options = normalizeOptions(input, isProduction)
    optionsCheck(options, isProduction)

    process.env.ROUTIFY_SSR_ENABLE = JSON.stringify(options.render.ssr.enable || '')

    return {
        name: 'routify-plugin',

        buildStart: async () => {
            if (options.run && !buildCount++) {
                const routify = new RoutifyBuildtime(options)
                await routify.start()
            }
        },

        config: cfg => {
            isSsr = !!cfg.build?.ssr
            if (isSsr) {
                // cfg.ssr.noExternal = true
                cfg.ssr.target = 'webworker'
            }
            return {
                appType:
                    cfg.appType || (options.render.ssr.enable ? 'custom' : undefined),
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
        transformIndexHtml: html => {
            if (!options.render.csr.enable) {
                console.log(
                    'replacereplacereplacereplacereplacereplacereplacereplacereplacereplacereplacereplacereplacereplace',
                )
                return html.replace(
                    /<script type="module" crossorigin src="\/assets\/index-.*?\.js"><\/script>/,
                    '',
                )
            }
        },
        configureServer:
            options.render.ssr.enable && (server => devServer(server, options)),
        configurePreviewServer:
            options.render.ssr.enable && (server => previewServer(server, options)),
        closeBundle: async () => {
            if (options.render.ssg.enable || options.render.ssr.enable) {
                // build again, this time in the dist/server dir
                if (!isSsr) await build({ build: { ssr: true } })
                else await postSsrBuildProcess(options)
            }
        },

        transform: (str, id) =>
            isProduction && !options.forceLogging && stripLogs(id, str),
    }
}
