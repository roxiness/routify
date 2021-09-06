import '../../typedef.js'
import { RoutifyBuildtime } from '#lib/buildtime/RoutifyBuildtime.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'

/**
 * @typedef {Object} VitePluginOptions
 * @prop {Boolean} run run Routify
 */

/**
 * @param {Partial<RoutifyBuildtimeOptions & VitePluginOptions>} options
 * @returns
 */
export default function RoutifyPlugin(options = {}) {
    options.watch = options.watch ?? isProduction
    options.run = options.run ?? true

    return {
        name: 'routify-plugin',
        options: async () => {
            if (options.run) {
                const routify = new RoutifyBuildtime(options)
                await routify.start()
            }
        },
        config: () => ({
            resolve: {
                alias: {
                    '#root': __dirname + '/../..',
                    '#lib': __dirname + '/../../lib',
                },
            },
            build: {
                polyfillDynamicImport: false,
                cssCodeSplit: false,
            },
        }),
        transform: (code, id) =>
            id.match(/routify3?\/lib/) &&
            code
                .replace(
                    /\/\/ *routify-dev-only-start[\s\S]+?\/\/ *routify-dev-only-end/gim,
                    '',
                )
                .replace(/.+ \/\/ *routify-dev-only/gi, ''),
    }
}
