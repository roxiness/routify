import {
    log,
    urlFromAddress,
    getLogLevel,
    setLogLevel,
    debugWrapper,
} from '../utils.js'
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

    /** @param {string} name router name */
    urlFromBrowser = name =>
        debugWrapper(
            this.browserAdapter.toRouter,
            'calling browserAdapter.toRouter',
        )(urlFromAddress(), { name })

    register(instance) {
        this.instances.push(instance)
        return this
    }
}

export const globalInstance = new Global()
