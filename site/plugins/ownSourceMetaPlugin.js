import { readFileSync } from 'fs'

export default () => ({
    name: 'sourceMeta',
    before: 'metaSplit',
    build: ({ instance }) => {
        instance.nodeIndex.forEach(node => {
            if (!node.file.stat.isDirectory())
                node.meta.src = {
                    value: readFileSync(node.file.path, 'utf-8'),
                    split: true,
                }
        })
    },
})
