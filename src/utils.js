import { get } from 'svelte/store'
import { route } from './store'
import { routes } from '../dist/routes'

export const url = (path, params) => {

    if (path.match(/^\.\.?\//)) {
        //RELATIVE PATH
        // strip component from existing route
        let url = get(route).url.replace(/[^\/]+$/, '')

        // traverse through parents if needed
        const traverse = path.match(/\.\.\//g)
        if (traverse)
            for (let i = 1; i <= traverse.length; i++) {
                url = url.replace(/[^\/]+\/$/, '')
            }

        // strip leading periods and slashes
        path = path.replace(/^[\.\/]+/, '')
        path = url + path
    } else if (path.match(/^\//)) {
        // ABSOLUTE PATH
    } else {
        // NAMED PATH        
        let newPath = routes.filter(r => r.name === path)[0]
        if (!newPath) console.error(`a path named '${path}' does not exist`)
        else 
            path = newPath.url.replace(/\/index$/, '')
    }

    params = Object.assign({}, get(route).params, params)
    for (let [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, value)
    }
    return path
}

export const matchRoute = (url, routes)=> {
    const urlWithIndex = url.match(/\/index\/?$/) ? url : (
        (url + "/index").replace(/\/+/g, "/") //remove duplicate slashes
    )

    let route, match, fallback, fallbackMatch

    for (let i = 0, len = routes.length; i < len; i++) {
        const { [i]: r } = routes

        if (r.isFallback) {
            if (fallback) {
                continue
            } else if (fallbackMatch = urlWithIndex.match(r.regex)) {
                fallback = r
                url = urlWithIndex
            } else if (fallbackMatch = url.match(r.regex)) {
                fallback = r
            }
        } else if (match = urlWithIndex.match(r.regex)) {
            route = r
            url = urlWithIndex
        } else if (match = url.match(r.regex)) {
            route = r
        }

        if (route) break
    }

    if (!route) {
        if (!fallback) throw new Error(
            `Route could not be found. Make sure ${url}.svelte, ${url}/index.svelte or a fallback exists. A restart may be required.`
        )

        route = fallback
        match = fallbackMatch
    }

    const params = {}

    if (route.paramKeys) {
        for (let i = 0, len = route.paramKeys.length; i < len; i++) {
            const { [i]: key } = route.paramKeys
            params[key] = match[i + 1]
        }
    }

    return { url, match, params, route }
}
