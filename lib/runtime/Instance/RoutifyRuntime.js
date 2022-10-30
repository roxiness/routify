import { RNodeRuntime } from './RNodeRuntime.js'
import { appInstance } from '../Global/Global.js'
import { Routify } from '../../common/Routify.js'

/**
 * @extends {Routify<typeof RNodeRuntime>}
 */
export class RoutifyRuntime extends Routify {
    NodeConstructor = RNodeRuntime
    mode = 'runtime'

    /**@type {Router[]} routers this instance belongs to */
    routers = []

    /** @type {Object<string, RNodeRuntime>} */
    rootNodes = {}

    constructor(options) {
        super()

        this.options = options
        if (options.routes) {
            this.rootNodes[options.routes.rootName || 'unnamed'] = this.createNode(
                options.routes.rootName,
            ).importTree(options.routes)
        }
        this.global = appInstance.register(this)
        Object.defineProperty(this, 'routers', { enumerable: false })
        this.log = this.global.log
    }
}
