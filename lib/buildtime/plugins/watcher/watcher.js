import CheapWatch from 'cheap-watch'

const watchedInstances = []

/**
 * @param {RoutifyBuildtimePayload} param0
 */
export const watcher = async ({ instance }) => {
    if (!instance.options.watch) return

    const dirs = Object.values(instance.rootNodes).map(c =>
        c.file.stat.isDirectory() ? c.file.path : c.file.dir,
    )

    if (!watchedInstances.includes(instance)) {
        watchedInstances.push(instance)
        const promises = dirs.map(async dir => {
            const watcher = new CheapWatch({ dir })
            await watcher.init()
            instance.close = () => watcher.close()

            watcher.on('+', ({ path, isNew, stats }) => {
                if (!stats.isDirectory()) {
                    if (isNew) {
                        instance.on.fileAdded.run(path)
                    } else {
                        instance.on.fileChanged.run(path)
                    }
                    const msg = `${dir}/${path} (${isNew ? 'created' : 'updated'})`
                    instance.build(msg)
                }
            })
            watcher.on('-', ({ path, stats }) => {
                if (stats.isDirectory()) return
                const msg = `${dir}/${path} (deleted)`
                instance.build(msg)
            })
        })
        await Promise.all(promises)
    }
}
