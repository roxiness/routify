import { writable, derived } from 'svelte/store'

export const route = writable(null) // the actual route being rendered
export const routes = writable([]) // all routes
export const urlRoute = writable({})  // the route matching the url
export const basepath = writable("") // basepath regex
export const location = derived( // the part of the url matching the basepath
    [basepath, urlRoute],
    ([$basepath, $route]) => {
        const url = window.location.pathname
        const [, base, path] = url.match(`^(${$basepath})(${$route.regex})`) || []
        return { base, path }
    }
)
