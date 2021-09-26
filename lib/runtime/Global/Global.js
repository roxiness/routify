import {
    urlFromAddress,
    createRootLogger, // ROUTIFY-DEV-ONLY
    debugWrapper, // ROUTIFY-DEV-ONLY
} from '../utils/index.js'
import { BrowserAdapter } from './BrowserAdapter.js'

export class Global {
    /** @type {RoutifyRuntime[]} */
    instances = []

    constructor() {
        if (typeof window !== 'undefined') window['__routify'] = this

        this.log = createRootLogger() // ROUTIFY-DEV-ONLY
    }

    /** @type {Router[]} */
    get routers() {
        return [].concat(...this.instances.map(instance => instance.routers))
    }

    browserAdapter = BrowserAdapter()

    /** @param {string} name router name */
    urlFromBrowser = name => {
        // ROUTIFY-DEV-ONLY-START
        if (debugWrapper)
            return debugWrapper(
                this.browserAdapter.toRouter,
                'calling browserAdapter.toRouter',
            )(urlFromAddress(), { name })
        // ROUTIFY-DEV-ONLY-END

        return this.browserAdapter.toRouter(urlFromAddress(), { name })
    }

    register(instance) {
        this.instances.push(instance)
        return this
    }
}

export const globalInstance = new Global()
