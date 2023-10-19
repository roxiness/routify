/**
 * @typedef {[routerName:string, url:string]} UrlPair
 */

import { appInstance } from '../index.js'
import { createRouter } from '../Router/Router.js'
import { couldNotFindRoutes, noRoutesMapProvided } from '../utils/messages.js'

/**
 * @typedef {Object.<string, ()=>Promise>} RoutesMap
 */

/**
 * @typedef {Object} PreloadOptions
 * @property {RoutesMap=} routesMap
 * @property {string | string[] =} url
 */

const getWindowUrl = () =>
    typeof window === 'undefined'
        ? ''
        : window.location.pathname + window.location.search + window.location.hash

/**
 * Preloads all stale routers. A router is stale if it's present in the composite url,
 * but its current route doesn't match the composite url
 * @param {string | string[] | PreloadOptions=} urlOrOptions composite url - can contain a single or multiple urls separated by ";"
 */
export const preloadUrl = urlOrOptions => {
    /** @type {PreloadOptions} */
    const options =
        typeof urlOrOptions === 'string' || Array.isArray(urlOrOptions)
            ? { url: urlOrOptions }
            : urlOrOptions

    let { url, routesMap } = options

    url =
        url ??
        import.meta['env']?.ROUTIFY_URL ??
        import.meta['env']?.URL ??
        getWindowUrl()

    const urls = Array.isArray(url) ? url : [url]

    return Promise.all(
        urls.map(url => preloadUrlFromUrlPairs(getUrlSegments(url), routesMap)),
    )
}

const createNewRouter = async (name, url, routesMap) => {
    const fullName = name || 'default'
    if (!routesMap) console.error(noRoutesMapProvided(fullName))
    const getRoutes = routesMap[fullName]
    if (!getRoutes) {
        console.error(couldNotFindRoutes(fullName))
        return false
    }

    return createRouter({ name, url, routes: await getRoutes() })
}

/**
 * Preloads all stale routers. A router is stale if it's present in the composite url,
 * but its current route doesn't match the composite url
 * @param {UrlPair[]} urlPairs composite url - can contain a single or multiple urls
 * @param {RoutesMap=} routesMap
 */
export const preloadUrlFromUrlPairs = async (urlPairs, routesMap) => {
    const routerPromises = urlPairs.map(async ([name, url]) => {
        const matchingRouter = appInstance.routers.find(router => router.name === name)

        const router = matchingRouter || (await createNewRouter(name, url, routesMap))
        if (!router) return false

        // if router has none or bad url, use url from the urlPair
        const currentRoute = router.pendingRoute.get() || router.activeRoute.get()
        if (currentRoute?.url !== url) router.url.replace(url)

        return router
    })

    const routers = await Promise.all(routerPromises)

    await Promise.all(routers.map(router => router && router.ready()))
    return routers.map(router => router.activeRoute?.get().load)
}

/**
 * Parses a composite url into a list of url pairs
 * Eg. "/path/to/page;router1=/path/to/page;router2=/path/to/page" => [["", "/path/to/page"], ["router1", "/path/to/page"], ["router2", "/path/to/page"]]
 * @param {string} compositeUrl
 * @returns
 */
const getUrlSegments = compositeUrl =>
    compositeUrl.split(';').map(urlSegmentToRouterAndUrl)

/**
 * Parses a url segment into a router name and url
 * Eg. "router1=/path/to/page" => ["router1", "/path/to/page"]
 * @param {string} urlSegment
 * @param {number} index
 * @returns {[routerName:string, url:string]}
 */
const urlSegmentToRouterAndUrl = (urlSegment, index) => {
    if (!index) return ['', urlSegment]
    const matches = urlSegment.match(/([\w-]+?)=(.*)/)
    return [matches[1], matches[2]]
}

/**
 * Returns the primary url from a list of url pairs
 * The primary url is the one without a router name
 * @param {UrlPair[]} urlPairs
 * @returns
 */
export const getPrimaryUrl = urlPairs => urlPairs.find(([name]) => name === '')[1]
