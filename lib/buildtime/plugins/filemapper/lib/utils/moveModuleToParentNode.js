import { nameFilter } from '../../utils.js'

/**
 * for nodes that have a _module.svelte or _reset.svelte file,
 * `file` prop and module is moved to node.parent and the old node is removed
 * @param {RNodeBuildtime} node
 */
export const moveModuleToParentNode = node => {
    const { options } = node.instance
    const { moduleFiles } = options.filemapper
    const { extensions } = options

    const filenames = moduleFiles.map(name => extensions.map(ext => name + ext)).flat()

    node.descendants.filter(nameFilter(filenames)).forEach(node => {
        node.parent.module = node.module
        node.parent.file = node.file
        node.parent.meta = node.meta
        node.remove()
    })
}
