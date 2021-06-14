import '#root/typedef.js'
import { bundler } from './bundler.js'

/** @type {RoutifyPlugin} */
export const bundlerPlugin = {
    condition: () => true,
    after: 'filemapper',
    mode: 'compile',
    run: bundler,
}
