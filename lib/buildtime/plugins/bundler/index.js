import { bundler } from './bundler.js'

/** @type {RoutifyBuildtimePlugin} */
export const bundlerPlugin = {
    name: 'bundler',
    after: 'filemapper',
    build: bundler,
}
