import { derived } from 'svelte/store'
import { Routify } from '../common/Routify.js'
import { deepAssign, sortPlugins } from '../common/utils.js'
import { importerPlugin } from '../plugins/importer/index.js'
import { InstanceUtils } from './InstanceUtils.js'
import { RNodeRuntime } from './RNodeRuntime.js'
import * as urlHandlers from './urlHandler/index.js'
import { getPathNodesFromUrlAndNodes } from './utils.js'

const getDefaults = () => ({
    plugins: [importerPlugin],
    autoStart: true,
    urlHandler: typeof window === 'undefined' ? 'internal' : 'address',
})

/**
 * @extends {Routify<RNodeRuntimeConstructor>}
 */
export class RoutifyRuntime extends Routify {
    Node = RNodeRuntime
    #urlHandler

    constructor(options) {
        super(deepAssign(getDefaults(), options))
        this.plugins.push(this.options.plugins)
        this.utils = new InstanceUtils()
        Object.defineProperty(this, 'plugins', { enumerable: false })
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

    get urlHandler() {
        if (!this.#urlHandler) this.urlHandler = this.options.urlHandler

        return this.#urlHandler
    }

    set urlHandler(urlHandler) {
        if (typeof urlHandler === 'string') urlHandler = urlHandlers[urlHandler]
        this.#urlHandler = urlHandler(this)
    }

    /**
     * store that returns a list of url fragments and their corresponding nodes
     */
    get activePathNodes() {
        return derived(this.urlHandler, $url => {
            const rootNode = this.superNode.children[0]
            return getPathNodesFromUrlAndNodes(rootNode, $url)
        })
    }

    get params() {
        return derived(this.activePathNodes, $activePathNodes =>
            $activePathNodes.reduce(
                (map, activePathNode) =>
                    Object.assign(map, activePathNode.params),
                {},
            ),
        )
    }
}
