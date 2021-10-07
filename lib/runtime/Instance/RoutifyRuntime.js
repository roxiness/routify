import { UrlParamUtils } from './UrlParamUtils.js'
import { RNodeRuntime } from './RNodeRuntime.js'
import { globalInstance } from '../Global/Global.js'
import { Routify } from '../../common/Routify.js'

/**
 * @extends Routify<typeof import('./RNodeRuntime')['RNodeRuntime']>
 */
export class RoutifyRuntime extends Routify {
    Node = RNodeRuntime
    mode = 'runtime'

    /**@type {Router[]} routers this instance belongs to */
    routers = []

    constructor(options) {
        super({ Node: RNodeRuntime })

        this.options = options
        if (options.routes) this.superNode.importTree(options.routes)
        this.utils = new UrlParamUtils()
        this.global = globalInstance.register(this)
        Object.defineProperty(this, 'routers', { enumerable: false })
        this.log = this.global.log
    }
}
