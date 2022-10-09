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

/**
 * @param {RNodeBuildtime} node
 * @returns {RNodeBuildtime[]}
 */
const findDescendantsWODefaults = (node, nested) => {
    // we expect the node to be the parent of a default, so we skip the first level
    const hasDefault =
        nested && node.children.find(node => node.meta.moduleName === 'default')
    return hasDefault
        ? []
        : [
              ...node.children,
              ...node.children.map(node => findDescendantsWODefaults(node, true)).flat(),
          ]
}

/**
 * @param {RNodeBuildtime} defaultNode
 */
export const propagateDefault = defaultNode => {
    const allChildren = findDescendantsWODefaults(defaultNode.parent)
    const children = allChildren.filter(node => !node.module)
    children.forEach(node => (node.module = defaultNode.module))
}

/** @type {RoutifyBuildtimePlugin} */
export const namedModulePlugin = {
    name: 'defaultModule',
    after: 'filemapper',
    before: 'bundler',
    build: ({ instance }) => {
        const isDefault = node => node.meta.moduleName === 'default'

        instance.nodeIndex.forEach(setNamedModule)
        instance.nodeIndex.filter(isDefault).forEach(propagateDefault)
    },
}
