import { readdirSync, readFileSync, statSync } from 'fs'
import { extname, resolve } from 'path'

const validExtensions = ['.md', '.js', '.svx', '.svelte']

const GetContent = basedir => name => {
    const filepath = resolve(basedir, name)
    const file = statSync(filepath)

    if (!file.isDirectory() && validExtensions.includes(extname(filepath)))
        return { name, content: readFileSync(filepath, 'utf-8') }
}

export default {
    name: 'sourceMeta',
    before: 'metaSplit',
    build: ({ instance }) => {
        instance.nodeIndex.forEach(node => {
            if (node.file.stat.isDirectory()) {
                node.meta.files = {
                    value: readdirSync(node.file.path)
                        .map(GetContent(node.file.path))
                        .filter(Boolean),
                    split: true,
                }
            }
        })
    },
}
