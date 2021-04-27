import chokidar from 'chokidar'
import '../../../typedef.js'

/**
 * @param {RoutifyBuildtimePayload} param0
 */ export const watcher = ({ instance }) => {
    const dirs = instance.superNode.children.map(c =>
        c.file.stat.isDirectory() ? c.file.path : c.file.dir,
    )

    if (!instance._chokidar) {
        const watcher = chokidar.watch(dirs, {
            ignoreInitial: true,
            awaitWriteFinish: false,
        })

        instance._chokidar = watcher
        instance.close = () => watcher.close()

        // event handling
        const eventHandler = createEventHandler(instance)

        watcher.on(
            'ready',
            eventHandler('fileWatcherReady', `Watching ${dirs.join(', ')}`),
        )
        watcher.on('add', eventHandler('fileAdded', 'File %s has been added'))
        watcher.on(
            'change',
            eventHandler('fileChanged', 'File %s has been changed'),
        )
        watcher.on(
            'unlink',
            eventHandler('fileRemoved', 'File %s has been removed'),
        )
    }
}

/**
 *
 * @param {RoutifyBuildtime} instance
 * @returns
 */
const createEventHandler = instance => (hook, msg) => async path => {
    instance.on[hook]
    instance.on[hook].callCallbacks(path)

    instance.build()
}
