import { RoutifyBuildtime } from '../buildtime/RoutifyBuildtime.js'

const isProduction = process.env.NODE_ENV === 'production'

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
            if (options.run) {
                const routify = new RoutifyBuildtime(options)
                await routify.start()
            }
            return null
        },

        config: () => ({
            build: {
                polyfillDynamicImport: false,
                cssCodeSplit: false,
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
