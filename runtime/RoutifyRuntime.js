import { Routify } from '../common/Routify.js'
import { sortPlugins } from '../common/utils.js'


export class RoutifyRuntime extends Routify {
    start () {
        this.plugins = this.plugins.filter(
            (plugin) => plugin.mode === 'runtime',
        )
        this.plugins = sortPlugins(this.plugins)
        const instance = this
        for (const plugin of this.plugins) {
            const shouldRun =
                typeof plugin.condition === 'undefined' ||
                plugin.condition({ instance })
            if (shouldRun) plugin.run({ instance })
        }
    }
}
