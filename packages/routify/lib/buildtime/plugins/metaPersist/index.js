import persistable from 'persistable'

/** @type {RoutifyBuildtimePlugin} */
export const metaPersistPlugin = {
    name: 'metaSplit',
    after: 'metaFromFile',
    before: 'exporter',
    build: () => {},
    metaContext: context => {
        const outputDir =
            '.persistent/' + context.tempPath.replace(/^.routify\/cached\//, '')
        /** @type {Persist} */
        context.persist = persistable({ outputDir })
        return context
    },
}
