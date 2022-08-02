/** @type {RoutifyBuildtimePlugin} */
export const devHelperPlugin = {
    name: 'devHelper',
    after: 'metaFromFile',
    before: 'exporter',
    build: () => {},
    transform: (id, content, instance) => {
        // @ts-ignore
        if (instance.options.devHelper && id.endsWith('.js'))
            content += `\n\nimport '@roxi/routify/lib/buildtime/plugins/devHelper/runtime.js'`
        return content
    },
}
