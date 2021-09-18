import { readFileSync } from 'fs'

/**
 * Plugin that saves a files content in its own meta.src
 */
export default () => ({
    name: 'sourceMeta',
    before: 'metaSplit',
    build: ({ instance, tools }) => {
        const { routifyDir } = instance.options
        instance.nodeIndex.forEach(node => {
            if (!node.file.stat.isDirectory())
                node.meta.src = tools.split(
                    readFileSync(node.file.path, 'utf-8'),
                    routifyDir + '/ownSourcePlugin/' + node.file.path + '.src.js',
                )
        })
    },
})
