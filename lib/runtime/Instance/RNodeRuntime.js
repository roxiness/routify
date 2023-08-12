import { RNode } from '../../common/RNode.js'
import Node from './Node.svelte'
import { RoutifyRuntime } from './RoutifyRuntime.js'
import { getRoutifyFragmentContext } from '../utils/index.js'

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

    // TODO DEPRECATE
    get pages() {
        console.log('DEPRECATED node.pages: use .linkableChildren instead') // ROUTIFY-DEV-ONLY
        return this.pagesWithIndex.filter(node => node.name !== 'index')
    }

    /**
     * Returns the title of the node. Looks for meta.title, falls back to capitalized name
     * Can be transformed with the router transformTitle hook
     * @returns {string}
     */
    get title() {
        const getPrettyName = () =>
            this.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        const getTitle = () => this.meta.title || getPrettyName()

        return getTitle()
    }

    // TODO DEPRECATE
    get pagesWithIndex() {
        console.log('DEPRECATED node.pagesWithIndex: use .linkableChildren instead') // ROUTIFY-DEV-ONLY
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
            let childPromises = []
            // if bundling or SSR, load children too
            if (this.meta.bundle || typeof window === 'undefined')
                childPromises = this.navigableChildren.map(c => c.loadModule())
            ;[this.module] = await Promise.all([this.asyncModule(), ...childPromises])
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
