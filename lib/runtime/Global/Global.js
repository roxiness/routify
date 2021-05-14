import { log, urlFromAddress, getLogLevel, setLogLevel } from '../utils.js'
import { BrowserAdapter } from './BrowserAdapter.js'

class Global {
    /** @type {RoutifyRuntime[]} */
    instances = []

    constructor() {
        Object.defineProperties(this, {
            instances: { enumerable: false },
            debugLevel: { get: getLogLevel, set: setLogLevel },
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
}

export const globalInstance = new Global()
