import { get } from 'svelte/store'
import * as stores from '../store'
import config from '../../runtime.config'

/**
 * @param {string} url 
 * @return {ClientNode}
 */
export function urlToRoute(url) {
    /** @type {RouteNode[]} */
    const routes = get(stores.routes)
    const basepath = get(stores.basepath)
    const route = routes.find(route => url.match(`^${basepath}${route.regex}`))
    if (!route)
        throw new Error(
            `Route could not be found for "${url}".`
        )

    const [, base] = url.match(`^(${basepath})${route.regex}`)
    const path = url.slice(base.length)

    if (config.queryHandler)
        route.params = config.queryHandler.parse(window.location.search)

    if (route.paramKeys) {
        const layouts = layoutByPos(route.layouts)
        const fragments = path.split('/').filter(Boolean)
        const routeProps = getRouteProps(route.path)

        routeProps.forEach((prop, i) => {
            if (prop) {
                route.params[prop] = fragments[i]
                if (layouts[i]) layouts[i].param = { [prop]: fragments[i] }
                else route.param = { [prop]: fragments[i] }
            }
        })
    }

    route.leftover = url.replace(new RegExp(base + route.regex), '')

    return route
}


/**
 * @param {array} layouts
 */
function layoutByPos(layouts) {
    const arr = []
    layouts.forEach(layout => {
        arr[layout.path.split('/').filter(Boolean).length - 1] = layout
    })
    return arr
}


/**
 * @param {string} url
 */
function getRouteProps(url) {
    return url
        .split('/')
        .filter(Boolean)
        .map(f => f.match(/\:(.+)/))
        .map(f => f && f[1])
}
