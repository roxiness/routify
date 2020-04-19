import { writable, derived } from 'svelte/store'
import '../typedef'

/** @type {import('svelte/store').Writable<RouteNode>} */
export const route = writable(null) // the actual route being rendered
export const routes = writable([]) // all routes

/** @type {import('svelte/store').Writable<RouteNode>} */
export const urlRoute = writable(null)  // the route matching the url

/** 
 * @typedef {import('svelte/store').Writable<String>} Basepath
 * @type {Basepath} */
export const basepath = (() => {
    const { set, subscribe } = writable("")

    return {
        subscribe,
        set(value) {
            if (value.match(/^\//))
                set(value)
            else console.warn('Basepaths must start with /')
        },
        update() { console.warn('Use assignment or set to update basepaths.') }
    }
})()

export const location = derived( // the part of the url matching the basepath
    [basepath, urlRoute],
    ([$basepath, $route]) => {
        const url = window.location.pathname
        const [, base, path] = url.match(`^(${$basepath})(${$route.regex})`) || []
        return { base, path }
    }
)
