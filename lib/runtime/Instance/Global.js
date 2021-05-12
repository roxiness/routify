import { BrowserAdapter } from './BrowserAdapter.js'

class Global {
    /** @type {RoutifyRuntime[]} */
    instances = []

    get routers() {
        return [].concat(this.instances.map(instance => instance.routers))
    }

    browserAdapter = BrowserAdapter()

    register(instance) {
        this.instances.push(instance)
        return this
    }

    debugLevel = 'info'
}

export const globalInstance = new Global()
