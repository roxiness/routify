/**
 * @typedef {[routerName:string, url:string]} UrlPair
 */

import { appInstance } from '../index.js'
import { createRouter } from '../Router/Router.js'

/**
 * Preloads all stale routers. A router is stale if it's present in the composite url,
 * but its current route doesn't match the composite url
 * @param {string | string[]=} url composite url - can contain a single or multiple urls separated by ";"
 */
export const preloadUrl = url => {
    url =
        url ||
        (import.meta['env']?.SSR
            ? import.meta['env'].URL
            : typeof window != 'undefined'
            ? window.location.pathname + window.location.search + window.location.hash
            : '')

    const urls = Array.isArray(url) ? url : [url]
    return Promise.all(urls.map(url => preloadUrlFromUrlPairs(getUrlSegments(url))))
}

/**
 * Preloads all stale routers. A router is stale if it's present in the composite url,
 * but its current route doesn't match the composite url
 * @param {UrlPair[]} urlPairs composite url - can contain a single or multiple urls
 */
export const preloadUrlFromUrlPairs = async urlPairs => {
    const routers = urlPairs.map(([name, url]) => {
        // use existing router, if one by this name exists, otherwise create a new one
        const router =
            appInstance.routers.find(router => router.name === name) ||
            createRouter({ name, url })

        // if router has none or bad url, use url from the urlPair
        const currentRoute = router.pendingRoute.get() || router.activeRoute.get()
        if (currentRoute?.url !== url) router.url.replace(url)

        return router
    })

    await Promise.all(routers.map(router => router.ready()))
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
    const matches = urlSegment.match(/([\w-]+?)=(.+)/)
    return [matches[1], matches[2]]
}

/**
 * Returns the primary url from a list of url pairs
 * The primary url is the one without a router name
 * @param {UrlPair[]} urlPairs
 * @returns
 */
export const getPrimaryUrl = urlPairs => urlPairs.find(([name]) => name === '')[1]
