import { RNode } from '../../common/RNode.js'
import Node from './Node.svelte'

/**
 * @extends RNode<typeof import('./RoutifyRuntime')['RoutifyRuntime']>
 */
export class RNodeRuntime extends RNode {
    /** @type {LoadSvelteModule} */
    asyncModule

    /**
     * @param {string} name
     * @param {ReservedCmpProps} module
     * @param {RoutifyRuntime} instance
     * @param {LoadSvelteModule} asyncModule
     */
    constructor(name, module, instance, asyncModule) {
        super(name, module, instance, asyncModule)

        /** @type {ReservedCmpProps} */
        this.module

        /** @type {LoadSvelteModule} */
        this.asyncModule
    }

    get children() {
        // todo could we avoid typecasting here?
        const nodes = /** @type {this[]} */ (this.instance.nodeIndex)
        return nodes
            .filter(node => node.parent === this)
            .sort((prev, curr) => (prev.meta.order || 0) - (curr.meta.order || 0))
    }

    /** @returns {this[]} */
    get pages() {
        return this.children
            .filter(node => node.name !== 'index')
            .filter(node => !node.meta.fallback)
            .filter(node => !node.name.startsWith('_'))
            .filter(node => !node.name.includes('['))
            .filter(node => !(node.meta?.order === false))
    }

    /** @ts-ignore SvelteComponentConstructor is only available in VSCode */
    /** @returns {Promise<SvelteComponentDev<*, *>>} */
    async getRawComponent() {
        const module = await this.loadModule()
        return module.default
    }

    async loadModule() {
        if (!this.module && this.asyncModule) {
            this.module = await this.asyncModule()
        }
        return this.module
    }

    /** @returns {() => Node} */
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

    /** @param {RNodeRuntime} child  */
    appendChild(child) {
        if (child.instance) child.parent = this
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
