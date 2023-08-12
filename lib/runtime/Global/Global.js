import { urlFromAddress } from '../utils/index.js'
// ROUTIFY-DEV-ONLY-START
import { createRootLogger, debugWrapper } from '../utils/logger.js'
// ROUTIFY-DEV-ONLY-END

import { createBrowserAdapter } from './BrowserAdapter.js'

export class AppInstance {
    /** @type {RoutifyRuntime[]} */
    instances = []

    constructor() {
        globalThis['__routify'] = this

        this.log = createRootLogger() // ROUTIFY-DEV-ONLY
    }

    /** @type {Router[]} */
    get routers() {
        return [].concat(...this.instances.map(instance => instance.routers))
    }

    /** @type {import('../helpers/preload.js').RoutesMap} */
    routeMaps = {}

    browserAdapter = createBrowserAdapter()

    /** @param {Router} router */
    urlFromBrowser = router => {
        // ROUTIFY-DEV-ONLY-START
        if (debugWrapper)
            return debugWrapper(
                this.browserAdapter.toRouter,
                'calling browserAdapter.toRouter',
            )(urlFromAddress(), router)
        // ROUTIFY-DEV-ONLY-END

        return this.browserAdapter.toRouter(urlFromAddress(), router)
    }

    register(instance) {
        this.instances.push(instance)
        return this
    }
}

export const appInstance = new AppInstance()
