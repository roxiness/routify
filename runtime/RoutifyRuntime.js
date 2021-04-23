import { derived } from 'svelte/store'
import { Routify } from '../common/Routify.js'
import { deepAssign, sortPlugins } from '../common/utils.js'
import { importerPlugin } from '../plugins/importer/index.js'
import { InstanceUtils } from './InstanceUtils.js'
import { RNodeRuntime } from './RNodeRuntime.js'
import { createUrlStoreInternal } from './urlStores/internal.js'
import { getPathNodesFromUrlAndNodes } from './utils.js'

const getDefaults = () => ({
    plugins: [importerPlugin],
    autoStart: true,
})

/**
 * @extends {Routify<RNodeRuntimeConstructor>}
 */
export class RoutifyRuntime extends Routify {
    Node = RNodeRuntime

    constructor(options) {
        super(options)
        deepAssign(this.options, options)
        this.plugins.push(...getDefaults().plugins)
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

    urlStore = createUrlStoreInternal()

    /**
     * store that returns a list of url fragments and their corresponding nodes
     */
    activePathNodes = derived(this.urlStore, $url => {
        const rootNode = this.superNode.children[0]
        return getPathNodesFromUrlAndNodes(rootNode, $url)
    })

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
