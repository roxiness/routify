import { hashObj, split } from '../../utils.js'

/** @type {RoutifyBuildtimePlugin} */
export const metaSplitPlugin = {
    name: 'metaSplit',
    after: 'metaFromFile',
    before: 'exporter',
    build: () => {},
    metaContext: context => {
        const { routifyDir } = context.options
        context.split = (value, name) => {
            name = name || hashObj(value)
            return split(routifyDir)(value, context.tempPath + '/split/' + name + '.js')
        }
        return context
    },
}
