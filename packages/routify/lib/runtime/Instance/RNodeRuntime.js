import { RNode } from '../../common/RNode.js'
import Node from './Node.svelte'

/**
 * @extends RNode<typeof import('./RoutifyRuntime')['RoutifyRuntime']>
 */
export class RNodeRuntime extends RNode {
    /** @type {Object.<string,RegExp>} */
    #regex = {}

    get regex() {
        const { name } = this
        if (!this.#regex[name])
            this.#regex[name] = this.instance.utils.getRegexFromName(this.name)
        return this.#regex[name]
    }

    // save to regex key so regex gets invalidated if name changes
    set regex(value) {
        this.#regex[this.name] = new RegExp(value)
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
    /** @returns {Promise<SvelteComponentConstructor<*, *>>} */
    getRawComponent() {
        return (
            this.module &&
            new Promise(resolve => {
                const modulePromise = this.module()
                const rawComponent = modulePromise.then
                    ? modulePromise.then(r => r.default)
                    : modulePromise.default
                resolve(rawComponent)
            })
        )
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
