import { setContext } from 'svelte'
import { derived } from 'svelte/store'
import { Routify } from '../common/Routify.js'
import { deepAssign, sortPlugins } from '../common/utils.js'
import { importerPlugin } from '../plugins/importer/index.js'
import { InstanceUtils } from './InstanceUtils.js'
import { RNodeRuntime } from './RNodeRuntime.js'
import { Route } from './route/Route.js'
import * as activeUrls from './activeUrl/index.js'
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

    get activeUrl() {
        if (!this.#activeUrl) this.activeUrl = this.options.activeUrl
        return this.#activeUrl
    }

    set activeUrl(activeUrl) {
        if (typeof activeUrl === 'string') activeUrl = activeUrls[activeUrl]
        this.#activeUrl = activeUrl(this)
    }

    get activeRoute() {
        return derived(
            this.activeUrl,
            $url => new Route(this, $url, this.superNode.children[0]),
        )
    }

    get params() {
        return derived(this.activeRoute, $activeRoute => $activeRoute.params)
    }
}

const pushInstanceToGlobal = instance => {
    try {
        setContext('routify-instance', instance)
        window['__routify'] = window['__routify'] || { instances: [] }
        window['__routify'].instances.push(instance)
    } catch (err) {}
}
