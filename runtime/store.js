import { writable, derived } from 'svelte/store'
import '../typedef'
import { currentLocation } from './utils'

window.routify = window.routify || {}

/** @type {import('svelte/store').Writable<RouteNode>} */
export const route = writable(null) // the actual route being rendered

/** @type {import('svelte/store').Writable<RouteNode[]>} */
export const routes = writable([]) // all routes
routes.subscribe(routes => (window.routify.routes = routes))

export let rootContext = writable({ component: { params: {} } })

/** @type {import('svelte/store').Writable<RouteNode>} */
export const urlRoute = writable(null)  // the route matching the url

/** @type {import('svelte/store').Writable<String>} */
export const basepath = (() => {
    const { set, subscribe } = writable("")

    return {
        subscribe,
        set(value) {
            if (value.match(/^[/(]/))
                set(value)
            else console.warn('Basepaths must start with / or (')
        },
        update() { console.warn('Use assignment or set to update basepaths.') }
    }
})()

export const location = derived( // the part of the url matching the basepath
    [basepath, urlRoute],
    ([$basepath, $route]) => {
        const [, base, path] = currentLocation().match(`^(${$basepath})(${$route.regex})`) || []
        return { base, path }
    }
)

export const prefetchPath = writable("")