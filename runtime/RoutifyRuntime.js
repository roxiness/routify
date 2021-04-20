import { derived, writable } from 'svelte/store'
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
        deepAssign(this.options, options)
        this.plugins.push(...getDefaults().plugins)
        // if (this.options.autoStart)
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

    urlStore = createUrlStoreInternal(this)

    activeNodes = derived(this.urlStore, $url => {
        const [, ...parts] = $url.replace(/\/$/, '').split('/')

        let node = this.superNode.children[0]
        const nodes = [node] // start with rootNode
        for (const part of parts) {
            const child = node.children.find(child => child.name === part)
            if (child) {
                node = child
                nodes.push(node)
            } else {
                const fallbackIndex = nodes.findIndex(fbNode => fbNode.fallback)
                if (fallbackIndex === -1)
                    throw new Error(`could not find route: ${$url}`)
                nodes.splice(fallbackIndex)
                nodes.push(nodes[fallbackIndex].fallback)
                break
            }
        }

        let lastNode = nodes[nodes.length - 1]
        while (lastNode) {
            lastNode = lastNode.children.find(node => node.name === 'index')
            if (lastNode) nodes.push(lastNode)
        }

        const activeNodes = nodes.filter(Boolean).filter(node => node.component)

        if (!activeNodes.length)
            throw new Error(`could not find route: ${$url}`)
        return activeNodes
    })

    params = writable({})
}
