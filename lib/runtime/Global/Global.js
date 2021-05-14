import { log, urlFromAddress } from '../utils.js'
import { BrowserAdapter } from './BrowserAdapter.js'

class Global {
    /** @type {RoutifyRuntime[]} */
    instances = []

    constructor() {
        if (typeof window !== 'undefined') window['__routify'] = this
        Object.defineProperty(this, 'instances', {
            enumerable: false,
        })
        this.log = log
    }

    /** @type {Router[]} */
    get routers() {
        return [].concat(...this.instances.map(instance => instance.routers))
    }

    browserAdapter = BrowserAdapter()

    urlFromBrowser = routerName =>
        this.browserAdapter.toRouter(urlFromAddress(), { name: routerName })

    register(instance) {
        this.instances.push(instance)
        return this
    }

    debugLevel = 'debug'
}

export const globalInstance = new Global()
