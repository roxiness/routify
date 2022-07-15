import { deepSet } from '../../utils.js'

const hasDefaultModule = node => node.modules?.default
const getDefaultModule = node =>
    [node, ...node.ancestors].find(hasDefaultModule)?.modules.default.path
const useDefaultModule = node =>
    (node.module = node.module || getDefaultModule(node) || false)
const setNamedModule = node => {
    const name = node.file.name.match(/^_module@(.+)/)?.[1]
    if (name) deepSet(node.parent, 'modules', name, 'path', node.module)
}

/** @type {RoutifyBuildtimePlugin} */
export const namedModulePlugin = {
    name: 'defaultModule',
    after: 'filemapper',
    before: 'bundler',
    build: payload => {
        payload.instance.nodeIndex.forEach(setNamedModule)
        payload.instance.nodeIndex.forEach(useDefaultModule)
    },
}
