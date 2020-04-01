import { writable, derived } from 'svelte/store'

export const route = writable({}) // the actual route being rendered
export const routes = writable([]) // all routes
export const urlRoute = writable({})  // the route matching the url
export const basepath = writable('') // basepath regex
export const baseMatch = derived( // the part of the url matching the basepath
    [basepath, urlRoute],
    ([$basepath, $route]) => {
        const url = window.location.pathname
        const matches = url.match(`^(${$basepath})(${$route.regex})`)
        if (matches) return matches[1]
    }
)