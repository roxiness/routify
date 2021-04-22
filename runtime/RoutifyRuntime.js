import { derived, writable } from 'svelte/store'
import { Routify } from '../common/Routify.js'
import { deepAssign, sortPlugins } from '../common/utils.js'
import { importerPlugin } from '../plugins/importer/index.js'
import { RNodeRuntime } from './RNodeRuntime.js'
import { createUrlStoreInternal } from './urlStores/internal.js'
import { createInstanceUtils } from './utils.js'

const getDefaults = () => ({
    plugins: [importerPlugin],
    autoStart: true,
})

export class RoutifyRuntime extends Routify {
    Node = RNodeRuntime

    constructor(options) {
        super(options)
        deepAssign(this.options, options)
        this.plugins.push(...getDefaults().plugins)
        this.utils = createInstanceUtils()
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
        const renders = [{ node, part: '' }] // start with rootNode
        console.log(node.children)
        console.log(node.children.map(c => c.regex))
        for (const part of parts) {
            // child by name
            const child =
                node.children.find(child => child.name === part) ||
                node.children.find(child => child.regex.test(part))

            // console.log(child)
            if (child) {
                node = child
                renders.push({ node, part })
            } else {
                const fallbackIndex = renders.findIndex(
                    render => render.node.fallback,
                )
                if (fallbackIndex === -1)
                    throw new Error(`could not find route: ${$url}`)
                renders.splice(fallbackIndex)
                renders.push(renders.node[fallbackIndex].fallback)
                break
            }
        }

        let lastNode = renders[renders.length - 1].node
        while (lastNode) {
            lastNode = lastNode.children.find(node => node.name === 'index')
            if (lastNode) renders.push({ node: lastNode, part: '' })
        }

        const activeNodes = renders
            .filter(Boolean)
            .filter(render => render.node.component)
        // .map(render => RenderNode(render, instance))

        if (!activeNodes.length)
            throw new Error(`could not find route: ${$url}`)
        return activeNodes
    })

    params = writable({})
}

// class RenderNode {
//     #part
//     constructor(render, instance) {
//         this.node = render.node
//         this.#part = render.part
//         this.params = mapField
//         // this.params = mapFieldsW
//         //       mapFieldsWithValues (
//         //     getFieldsFromName(this.name),
//         //     getValuesFromPath(this.regex, this.dynamic.part),
//         // )
//     }
// }
