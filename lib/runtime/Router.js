import { derived, get } from 'svelte/store'
import { Route } from './route/Route.js'
import * as activeUrls from './activeUrl/index.js'
import { fromEntries } from './utils.js'

export class Router {
    constructor(instance, activeUrl, rootNode) {
        this.instance = instance
        activeUrl = activeUrl || instance.activeUrl

        activeUrl =
            typeof activeUrl === 'string' ? activeUrls[activeUrl] : activeUrl

        rootNode = rootNode || instance.superNode.children[0]

        this.activeUrl = activeUrl(instance)

        this.activeRoute = derived(
            this.activeUrl,
            $url => new Route(this, $url, rootNode),
        )

        this.params = derived(
            this.activeRoute,
            $activeRoute => $activeRoute.params,
        )
    }

    queryHandler = {
        parse: search => fromEntries(new URLSearchParams(search)),
        stringify: params => '?' + new URLSearchParams(params).toString(),
    }
}
