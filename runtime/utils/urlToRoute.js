import { get } from 'svelte/store'
import * as stores from '../store'
import config from '../../runtime.config'
import { parseUrl, resolveUrl } from './index'

/**
 * @param {string} url 
 * @return {ClientNode}
 */
export function urlToRoute(url, clone = false) {
    url = config.urlTransform.remove(url)
    let { pathname, search } = parseUrl(url).url

    /** @type {RouteNode[]} */
    const routes = get(stores.routes)
    const matchingRoute =
        // find a route with a matching name
        routes.find(route => pathname === route.meta.name) ||
        // or a matching path
        routes.find(route => pathname.match(route.regex))

    if (!matchingRoute)
        throw new Error(`Route could not be found for "${pathname}".`)

    // we want to clone if we're only previewing an URL
    const _matchingRoute = clone ? Object.create(matchingRoute) : matchingRoute

    const { route, redirectPath, rewritePath } = resolveRedirects(_matchingRoute, routes)

    if (rewritePath) {
        ({ pathname, search } = parseUrl(resolveUrl(rewritePath, route.params)).url)
        if (redirectPath)
            route.redirectTo = resolveUrl(redirectPath, route.params || {});
    }

    if (config.queryHandler)
        route.params = Object.assign({}, config.queryHandler.parse(search))

    assignParamsToRouteAndLayouts(route, pathname)

    route.leftover = url.replace(new RegExp(route.regex), '')
    return route
}

function assignParamsToRouteAndLayouts(route, pathname) {
    if (route.paramKeys) {
        const layouts = layoutByPos(route.layouts)
        const fragments = pathname.split('/').filter(Boolean)
        const routeProps = getRouteProps(route.path)

        routeProps.forEach((prop, i) => {
            if (prop) {
                route.params[prop] = fragments[i]
                if (layouts[i]) layouts[i].param = { [prop]: fragments[i] }
                else route.param = { [prop]: fragments[i] }
            }
        })
    }
}

/**
 * 
 * @param {RouteNode} route 
 * @param {RouteNode[]} routes 
 * @param {*} params 
 */
function resolveRedirects(route, routes, redirectPath, rewritePath) {
    const { redirect, rewrite } = route.meta

    if (redirect || rewrite) {
        redirectPath = redirect ? redirect.path || redirect : redirectPath
        rewritePath = rewrite ? rewrite.path || rewrite : redirectPath
        const redirectParams = redirect && redirect.params
        const rewriteParams = rewrite && rewrite.params

        const newRoute = routes.find(r => r.path.replace(/\/index$/,'') === rewritePath)

        if (newRoute === route) console.error(`${rewritePath} is redirecting to itself`)
        if (!newRoute) console.error(`${route.path} is redirecting to non-existent path: ${rewritePath}`)
        if (redirectParams || rewriteParams)
            newRoute.params = Object.assign({}, newRoute.params, redirectParams, rewriteParams)

        return resolveRedirects(newRoute, routes, redirectPath, rewritePath)
    }
    return { route, redirectPath, rewritePath }
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
