import { themes } from './themes.js'

/**
 * @type {RoutifyBuildtimePlugin}
 **/
export const themesPlugin = {
    name: 'themesPlugin',
    after: 'metaFromFile',
    before: 'exporter',
    build: async ctx => {
        themes(ctx)
    },
}
