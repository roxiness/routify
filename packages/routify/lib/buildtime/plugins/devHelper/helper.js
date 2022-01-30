import persistable from 'persistable'

/** @type {RoutifyBuildtimePlugin} */
export const devHelperPlugin = {
    name: 'metaSplit',
    after: 'metaFromFile',
    before: 'exporter',
    build: () => {},
    transform: (id, content, instance) => {
        if (instance.options.devHelper && id.endsWith('.js'))
            content += `\n\nimport '@roxi/routify/lib/buildtime/plugins/devHelper/runtime.js'`
        return content
    },
}
