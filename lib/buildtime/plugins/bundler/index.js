import '#root/typedef.js'
import { bundler } from './bundler.js'

/** @type {RoutifyPlugin} */
export const bundlerPlugin = {
    after: 'filemapper',
    build: bundler,
}
