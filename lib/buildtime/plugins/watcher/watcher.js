import CheapWatch from 'cheap-watch'
import '#root/typedef.js'

/**
 * @param {RoutifyBuildtimePayload} param0
 */
export const watcher = async ({ instance }) => {
    if (!instance.options.watch) return

    const dirs = instance.superNode.children.map(c =>
        c.file.stat.isDirectory() ? c.file.path : c.file.dir,
    )

    if (!instance._watched) {
        instance._watched = true
        const promises = dirs.map(async dir => {
            const watcher = new CheapWatch({ dir })
            await watcher.init()
            instance.close = () => watcher.close()

            watcher.on('+', ({ path, isNew, stats }) => {
                if (!stats.isDirectory()) {
                    if (isNew) {
                        instance.on.fileAdded.runHooks(path)
                    } else {
                        instance.on.fileChanged.runHooks(path)
                    }
                    const msg = `${dir}/${path} (${isNew ? 'created' : 'updated'})`
                    instance.build(msg)
                }
            })
            watcher.on('-', ({ path, stats }) => {
                if (stats.isDirectory()) return
                const msg = `${dir}/${stats} (deleted)`
                instance.build(msg)
            })
        })
        await Promise.all(promises)
    }
}
