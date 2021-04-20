import { Routify } from '../common/Routify.js'
import { deepAssign, sortPlugins } from '../common/utils.js'
import { importerPlugin } from '../plugins/importer/index.js'
import { createUrlStoreInternal } from './urlStores/internal.js'

const getDefaults = () => ({
    plugins: [importerPlugin],
    autoStart: true,
})

export class RoutifyRuntime extends Routify {
    init(options) {
        console.log('starting Routify Runtime...')
        deepAssign(this.options, options)
        this.plugins.push(...getDefaults().plugins)
        if (this.options.autoStart) this.start()
    }

    start() {
        this.plugins = this.plugins.filter(plugin => plugin.mode === 'runtime')
        this.plugins = sortPlugins(this.plugins)
        const instance = this
        for (const plugin of this.plugins) {
            const shouldRun =
                typeof plugin.condition === 'undefined' ||
                plugin.condition({ instance })
            if (shouldRun) plugin.run({ instance })
        }
    }

    urlStore = createUrlStoreInternal(this)

    activeNode(run) {}
}
