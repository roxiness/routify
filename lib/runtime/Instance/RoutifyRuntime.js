import { deepAssign, sortPlugins } from '#lib/common/utils.js'
import { importerPlugin } from '../plugins/importer/index.js'
import { Routify } from '#lib/common/Routify.js'
import { UrlParamUtils } from './UrlParamUtils.js'
import { RNodeRuntime } from './RNodeRuntime.js'
import { globalInstance } from '../Global/Global.js'

const getDefaults = () => ({ plugins: [importerPlugin] })

/**
 * @extends {Routify<RNodeRuntimeConstructor>}
 */
export class RoutifyRuntime extends Routify {
    Node = RNodeRuntime
    /**@type {Router[]} */
    routers = []

    constructor(options) {
        super(deepAssign(getDefaults(), options))
        this.global = globalInstance.register(this)
        this.utils = new UrlParamUtils()
        Object.defineProperty(this, 'plugins', { enumerable: false })
        this.start()
        this.log = this.global.log
        Object.defineProperty(this, 'routers', { enumerable: false })
    }

    start() {
        for (const plugin of this.plugins.filter(plugin => plugin.init))
            plugin.init({ instance: this })
    }
}
