import CheapWatch from 'cheap-watch'
import '#root/typedef.js'

/**
 * @param {RoutifyBuildtimePayload} param0
 */
export const watcher = ({ instance }) => {
    if (!instance.options.watch) return

    const dirs = instance.superNode.children.map(c =>
        c.file.stat.isDirectory() ? c.file.path : c.file.dir,
    )

    if (!instance._watched) {
        instance._watched = true
        dirs.forEach(dir => {
            const watcher = new CheapWatch({ dir })
            watcher.init()

            // instance.close = () => watcher.close()

            watcher.on('+', ({ path, isNew, stats }) => {
                if (stats.isDirectory()) return
                else if (isNew) {
                    instance.on.fileAdded.runHooks(path)
                    console.log(`File ${path} was created`)
                } else {
                    instance.on.fileChanged.runHooks(path)
                    console.log(`File ${path} was updated`)
                }
                instance.build()
            })
            watcher.on('-', ({ path, stats }) => {
                if (stats.isDirectory()) return
                console.log(`File ${path} was deleted`)
                instance.build()
            })
        })
    }
}
