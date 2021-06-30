import '#root/typedef.js'
import { metaSplit } from './metaSplit.js'

/** @type {RoutifyBuildtimePlugin} */
export const metaSplitPlugin = {
    name: 'metaSplit',
    after: 'metaFromFile',
    before: 'exporter',
    build: metaSplit,
}
