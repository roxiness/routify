import pino from 'pino/browser'
import { deepAssign, sortPlugins } from '#lib/common/utils.js'
import { importerPlugin } from '#lib/plugins/importer/index.js'
import { Routify } from '#lib/common/Routify.js'
import { InstanceUtils } from './InstanceUtils.js'
import { RNodeRuntime } from './RNodeRuntime.js'
import { fromEntries } from '../utils.js'
import { globalInstance } from './Global.js'

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
    /**@type {Router[]} */
    routers = []

    constructor(options) {
        super(deepAssign(getDefaults(), options))
        this.global = globalInstance.register(this)
        if (typeof window !== 'undefined') window['__routify'] = this.global
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

        Object.defineProperty(this, 'routers', { enumerable: false })
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
