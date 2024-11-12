/** @type {RoutifyBuildtimePlugin} */
export const omitDirFromPathPlugin = {
    name: 'omitDirFromPath',
    after: 'filemapper',
    before: 'bundler',
    build: ({ instance }) => {
        // find file names that are enclosed in a parenthesis
        const omittedDir = node => node.file.name.match(/\(([^)]+)\)/)

        // remove the node and move its children to the parent
        instance.nodeIndex.filter(omittedDir).forEach(node => {
            node.children.forEach(child => {
                child.parent = node.parent
                node.remove()
            })
        })
    },
}
