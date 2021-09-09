import { deepAssign, normalizePlugins, sortPlugins } from '#lib/common/utils.js'
import { importerPlugin } from '../plugins/importer/index.js'
import { UrlParamUtils } from './UrlParamUtils.js'
import { RNodeRuntime } from './RNodeRuntime.js'
import { globalInstance } from '../Global/Global.js'

/** @returns {Partial<RoutifyRuntime>} */
const getDefaults = () => ({ plugins: [importerPlugin] })

export class RoutifyRuntime {
    mode = 'runtime'

    /** @type {RNodeRuntime[]} */
    #nodeIndex = []

    Node = RNodeRuntime

    /**@type {Router[]} routers this instance belongs to */
    routers = []

    superNode = new this.Node('_ROOT', null, this)

    get nodeIndex() {
        return this.#nodeIndex
    }

    /** @param {Partial<RoutifyRuntime>} options */
    constructor(options) {
        /** @type {Partial<RoutifyRuntime>} */
        this.options = deepAssign({}, getDefaults(), options)
        /** @type {RoutifyRuntimePlugin[]} */
        const plugins = normalizePlugins(this.options.plugins || [])
        this.plugins = sortPlugins(plugins)
        this.global = globalInstance.register(this)
        this.utils = new UrlParamUtils() // todo remove
        Object.defineProperty(this, 'plugins', { enumerable: false })
        Object.defineProperty(this, 'routers', { enumerable: false })
        this.start()
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

    start() {
        for (const plugin of this.plugins) {
            if (plugin.init) plugin.init({ instance: this })
        }
    }
}
