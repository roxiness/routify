// todo should be unified with runtime plugin "reset"

/**
 * @param {RNodeBuildtime} node
 */
export const setNamedModule = node => {
    const matches = node.file.name.match(/^(.+)@(.+)?/)
    if (matches) {
        const [, name, module] = matches
        node.name = name
        if (parseInt(module).toString() === module)
            node.meta.moduleName = parseInt(module)
        else if (module) node.meta.reset = module
        else node.meta.reset = true
    } else {
        const name = node.file.name.match(/^_module-(.+)$/)?.[1]
        if (name) node.meta.moduleName = name
    }
}

/** @type {RoutifyBuildtimePlugin} */
export const namedModulePlugin = {
    name: 'defaultModule',
    after: 'filemapper',
    before: 'bundler',
    build: payload => {
        payload.instance.nodeIndex.forEach(setNamedModule)
    },
}
