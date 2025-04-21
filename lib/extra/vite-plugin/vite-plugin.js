import { RoutifyBuildtime } from '../../buildtime/RoutifyBuildtime.js'
import {
    normalizeOptions,
    optionsCheck,
    postSsrBuildProcess,
    stripLogs,
} from './utils.js'
import { devServer } from './devServer.js'
import { previewServer } from './previewServer.js'
import { build, loadEnv } from 'vite'
import dotenvExpand from 'dotenv-expand'
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
    /** @ts-ignore*/
    process.env.ROUTIFY_SSR_ENABLE =
        !!options.render.ssr.enable || !!options.render.ssg.enable

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

            options.routifyDir ||= './.routify'
            options.outDir = cfg.build?.outDir || 'dist'

            return {
                appType:
                    cfg.appType || (options.render.ssr.enable ? 'custom' : undefined),
                server: {
                    fs: {
                        strict: false,
                        allow: [options.routifyDir],
                    },
                },
                build: {
                    ssr:
                        cfg.build?.ssr === true
                            ? `${options.routifyDir}/render.js`
                            : cfg.build?.ssr,
                    outDir: `${options.outDir}/${cfg.build?.ssr ? 'server' : 'client'}`,
                },
                envPrefix: ['VITE_', 'ROUTIFY_'], // Ensure ROUTIFY_ prefix is parsed
                define: {
                    'import.meta.env.ROUTIFY_SSR_ENABLE': process.env.ROUTIFY_SSR_ENABLE,
                },
            }
        },
        transformIndexHtml: html => {
            // remove the script tag if we're not doing client side rendering
            if (!options.render.csr.enable) {
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
                if (!isSsr) {
                    const env = loadEnv('production', process.cwd())
                    dotenvExpand.expand({ parsed: env })
                    await build({ build: { ssr: true, outDir: options.outDir } })
                } else await postSsrBuildProcess(options)
            }
        },

        transform: (str, id) =>
            isProduction && !options.forceLogging && stripLogs(id, str),
    }
}
