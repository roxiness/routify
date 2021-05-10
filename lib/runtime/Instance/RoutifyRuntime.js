import pino from 'pino/browser'
import { Routify } from '#lib/common/Routify.js'
import { deepAssign, sortPlugins } from '#lib/common/utils.js'
import { importerPlugin } from '#lib/plugins/importer/index.js'
import { InstanceUtils } from './InstanceUtils.js'
import { RNodeRuntime } from './RNodeRuntime.js'
import { fromEntries } from '#lib/runtime/utils.js'

const getDefaults = () => ({
    plugins: [importerPlugin],
    autoStart: true,
    activeUrl: typeof window === 'undefined' ? 'internal' : 'address',
})

/**
 * @extends {Routify<RNodeRuntimeConstructor>}
 */
export class RoutifyRuntime extends Routify {
    Node = RNodeRuntime

    constructor(options) {
        super(deepAssign(getDefaults(), options))
        pushInstanceToGlobal(this)
        this.plugins.push(this.options.plugins)
        this.utils = new InstanceUtils()
        Object.defineProperty(this, 'plugins', { enumerable: false })
        this.start()

        this.log = pino({
            level:
                typeof window !== 'undefined'
                    ? window.__routify.debugLevel || 'info'
                    : process.env.DEBUG_LEVEL || 'info',
        })
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

    queryHandler = {
        parse: search => fromEntries(new URLSearchParams(search)),
        stringify: params => '?' + new URLSearchParams(params).toString(),
    }
}

const pushInstanceToGlobal = instance => {
    try {
        window['__routify'] = window['__routify'] || { instances: [] }
        window['__routify'].instances.push(instance)
    } catch (err) {}
}
