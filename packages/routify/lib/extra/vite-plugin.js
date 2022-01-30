import { RoutifyBuildtime } from '../buildtime/RoutifyBuildtime.js'

const isProduction = process.env.NODE_ENV === 'production'

// not sure why Vite/Kit runs buildStart multiple times
let buildCount = 0

/**
 * @typedef {Object} VitePluginOptions
 * @prop {Boolean} run run Routify
 * @prop {Boolean} forceLogging force logging in production
 */

/**
 * @param {Partial<RoutifyBuildtimeOptions & VitePluginOptions>=} options
 * @returns
 */
export default function RoutifyPlugin(options = {}) {
    options.watch = options.watch ?? !isProduction
    options.run = options.run ?? true

    return {
        name: 'routify-plugin',

        buildStart: async () => {
            if (options.run && !buildCount++) {
                const routify = new RoutifyBuildtime(options)
                await routify.start()
            }
            return null
        },

        config: () => ({
            server: {
                fs: {
                    strict: false,
                    allow: ['./.routify'],
                },
            },
            build: {
                polyfillDynamicImport: false,
            },
        }),

        transform: (code, id) =>
            isProduction &&
            !options.forceLogging &&
            id.match(/routify3?\/lib/) &&
            code
                .replace(
                    /\/\/ *routify-dev-only-start[\s\S]+?\/\/ *routify-dev-only-end/gim,
                    '',
                )
                .replace(/.+ \/\/ *routify-dev-only/gi, ''),
    }
}
