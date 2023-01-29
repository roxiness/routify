import { RNode } from '../../common/RNode.js'
import Node from './Node.svelte'
import { RoutifyRuntime } from './RoutifyRuntime.js'

/**
 * @extends {RNode<RoutifyRuntime>}
 */
export class RNodeRuntime extends RNode {
    /** @type {LoadSvelteModule} */
    asyncModule

    /**
     * @param {string} name
     * @param {ReservedCmpProps} module
     * @param {RoutifyRuntime} instance
     * @param {LoadSvelteModule=} asyncModule
     */
    constructor(name, module, instance, asyncModule) {
        super(name, module, instance)

        /** @type {ReservedCmpProps} */
        this.module = module

        /** @type {LoadSvelteModule} */
        this.asyncModule = asyncModule
    }

    get children() {
        return this.instance.nodeIndex
            .filter(node => node.parent === this)
            .sort((prev, curr) => (prev.meta.order || 0) - (curr.meta.order || 0))
    }

    get pages() {
        return this.pagesWithIndex.filter(node => node.name !== 'index')
    }

    get pagesWithIndex() {
        return this.children
            .filter(node => !node.meta.fallback)
            .filter(node => !node.name.startsWith('_'))
            .filter(node => !node.name.includes('['))
            .filter(node => !(node.meta?.order === false))
    }

    get hasComponent() {
        return !!(this.module || this.asyncModule)
    }

    /** @ts-ignore SvelteComponentConstructor is only available in VSCode */
    /** @returns {Promise<SvelteComponentDev>} */
    async getRawComponent() {
        const module = await this.loadModule()
        return module?.default
    }

    async loadModule() {
        if (!this.module && this.asyncModule) {
            this.module = await this.asyncModule()
        }
        return this.module
    }

    /**
     * Returns in a sync/async component in a synchronous wrapper
     * @returns {() => Node}
     **/
    get component() {
        const node = this

        return function (options) {
            options.props = {
                ...options.props,
                passthrough: options.props,
                node,
            }
            return new Node({ ...options })
        }
    }

    /**
     * @param {object} snapshotRoot
     */
    importTree = snapshotRoot => {
        const queue = [[this, snapshotRoot]]

        while (queue.length) {
            const [node, snapshot] = queue.pop()
            const { children, ...nodeSnapshot } = snapshot
            Object.assign(node, nodeSnapshot)

            // queue children
            for (const childSnapshot of children) {
                const childNode = node.createChild(
                    snapshot.name || snapshot.rootName || '',
                )
                queue.push([childNode, childSnapshot])
            }
        }
        return this
    }

    get _fallback() {
        return this.children.find(node => node.meta.fallback) || this.parent?._fallback
    }
}
