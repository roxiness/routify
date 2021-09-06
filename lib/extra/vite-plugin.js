import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default function RoutifyPlugin() {
    return {
        name: 'routify-plugin',
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
