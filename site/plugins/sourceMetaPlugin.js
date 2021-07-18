import { readdirSync, readFileSync, statSync } from 'fs'
import { extname, resolve } from 'path'

const validExtensions = ['.md', '.js', '.svx', '.svelte']

const GetContent = basedir => name => {
    const filepath = resolve(basedir, name)
    const file = statSync(filepath)

    if (!file.isDirectory() && validExtensions.includes(extname(filepath)))
        return { name, content: readFileSync(filepath, 'utf-8') }
}

export default () => ({
    name: 'sourceMeta',
    before: 'metaSplit',
    build: ({ instance }) => {
        instance.nodeIndex.forEach(node => {
            const dir =
                node.file.name === '_module'
                    ? node.file.dir
                    : node.file.stat.isDirectory()
                    ? node.file.path
                    : null

            if (dir) {
                node.meta.files = {
                    value: readdirSync(dir).map(GetContent(dir)).filter(Boolean),
                    split: true,
                }
            }
        })
    },
})
