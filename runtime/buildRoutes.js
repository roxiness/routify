import { pathToParams, pathToRank, pathToRegex } from './utils'

export function buildRoutes(routes, routeKeys) {
    return routes
        // .map(sr => deserializeRoute(sr, routeKeys))
        .map(decorateRoute)
        .sort((c, p) => (c.ranking >= p.ranking ? -1 : 1))
}

const decorateRoute = function (route) {
    route.paramKeys = pathToParams(route.path)
    route.regex = pathToRegex(route.path, route.isFallback)
    route.name = route.path
        .match(/[^\/]*\/[^\/]+$/)[0]
        .replace(/[^\w\/]/g, '') //last dir and name, then replace all but \w and /
    route.ranking = pathToRank(route)
    route.url = route.path.replace(/\[([^\]]+)\]/, ':$1')

    return route
}

export function deserializeRoute(route, keys) {
    const obj = {}
    route.forEach((v, i) => { obj[keys[i]] = v })
    return obj
}
