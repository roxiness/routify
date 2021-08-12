import '#root/typedef.js'
import { RNode } from '#lib/common/RNode.js'
import Node from './Node.svelte'

const filters = {
    indexed: nodes =>
        nodes
            .filter(node => node.name !== 'index')
            .filter(node => !node.meta.fallback)
            .filter(node => !node.name.startsWith('_'))
            .filter(node => !(node.meta?.order === false)),
    public: nodes =>
        nodes
            .filter(node => !node.meta.fallback)
            .filter(node => !node.name.startsWith('_')),
}

/**
 * @extends {RNode<RoutifyRuntime>}
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

    /**
     * @typedef {Object} Filters
     * @prop {RNodeRuntime[]} indexed
     * @prop {RNodeRuntime[]} public
     */

    /** @type { RNodeRuntime[] & Filters & Object.<string,any> } */
    get children() {
        const nodes = this.instance.nodeIndex
        /** @type {RNode<RoutifyRuntime>[]} */
        const children = nodes
            .filter(node => node.parent === this)
            .sort((prev, curr) => (prev.meta.order || 0) - (curr.meta.order || 0))

        return new Proxy(children, {
            get: (target, property) => {
                if (property in target) return target[property]
                else if (property in filters) return filters[property](target)
                else return target.find(node => node.name === property)
            },
            ownKeys: target => [
                ...target.map(node => node.name),
                ...Object.keys(filters),
                ...Reflect.ownKeys(target),
            ],
        })
    }

    /** @returns {Promise<SvelteComponentConstructor<*, *>>} */
    get rawComponent() {
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

    get _fallback() {
        return this.children.find(node => node.meta.fallback) || this.parent._fallback
    }
}
