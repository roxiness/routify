import { UrlParamUtils } from './UrlParamUtils.js'
import { RNodeRuntime } from './RNodeRuntime.js'
import { globalInstance } from '../Global/Global.js'

/** @returns {Partial<RoutifyRuntime>} */

export class RoutifyRuntime {
    mode = 'runtime'

    /** @type {RNodeRuntime[]} */
    nodeIndex = []

    Node = RNodeRuntime

    /**@type {Router[]} routers this instance belongs to */
    routers = []

    superNode = new this.Node('_ROOT', null, this)

    /** @param {Partial<RoutifyRuntime>} options */
    constructor(options) {
        /** @type {Partial<RoutifyRuntime>} */
        this.options = options
        if (options.routes) this.superNode.importTree(options.routes)
        this.utils = new UrlParamUtils()
        this.global = globalInstance.register(this)
        Object.defineProperty(this, 'routers', { enumerable: false })
        this.log = this.global.log
    }

    /**
     * @param {string} name relative path for the node
     * @param {any|string} module svelte component
     * @returns {RNodeRuntime}
     */
    createNode(name, module) {
        return new this.Node(name, module, this)
    }
}
