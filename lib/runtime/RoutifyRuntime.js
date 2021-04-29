import { setContext } from 'svelte'
import { Routify } from '../common/Routify.js'
import { deepAssign, sortPlugins } from '../common/utils.js'
import { importerPlugin } from '../plugins/importer/index.js'
import { InstanceUtils } from './InstanceUtils.js'
import { RNodeRuntime } from './RNodeRuntime.js'
import { fromEntries } from './utils.js'

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
    #activeUrl

    constructor(options) {
        super(deepAssign(getDefaults(), options))
        this.plugins.push(this.options.plugins)
        this.utils = new InstanceUtils()
        this.activeUrl = this.options.activeUrl
        Object.defineProperty(this, 'plugins', { enumerable: false })
        pushInstanceToGlobal(this)
        this.start()
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
        setContext('routify-instance', instance)
        window['__routify'] = window['__routify'] || { instances: [] }
        window['__routify'].instances.push(instance)
    } catch (err) {}
}
