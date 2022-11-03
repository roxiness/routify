import { SvelteComponentDev } from 'svelte/internal'
import { appInstance } from '../../runtime/index.js'
import { createRouter } from '../../runtime/Router/Router.js'

/**
 * @typedef {[name:string, url:string]} UrlPair
 */

const urlSegmentToRouterAndUrl = (urlSegment, index) => {
    if (!index) return ['', urlSegment]
    const matches = urlSegment.match(/([\w-]+?)=(.+)/)
    return [matches[1], matches[2]]
}

const getUrlSegments = compositeUrl =>
    compositeUrl.split(';').map(urlSegmentToRouterAndUrl)

/**
 *
 * @param {UrlPair[]} urlPairs
 * @returns
 */
const getPrimaryUrl = urlPairs => urlPairs.find(([name]) => name === '')[1]

/**
 * Returns a statically rendered Routify app
 * @param {(SvelteComponentDev|{default: SvelteComponentDev}) & {load: (url:string)=>Promise<any>}} module App.svelte
 * @param {string} compositeUrl one or multiple urls separated by ";<routerName>="
 * @returns
 */
export const renderModule = async (module, compositeUrl) => {
    const render = module.default?.render || module['render']

    const urlPairs = getUrlSegments(compositeUrl)
    const load = module.load ? await module.load(getPrimaryUrl(urlPairs)) : {}
    await preloadUrlFromUrlPairs(urlPairs)
    return { ...(await render()), load }
}

/**
 * Preloads all stale routers. A router is stale if it's present in the composite url,
 * but its current route doesn't match the composite url
 * @param {UrlPair} urlPairs composite url - can contain a single or multiple urls
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
 * Preloads all stale routers. A router is stale if it's present in the composite url,
 * but its current route doesn't match the composite url
 * @param {string | string[]=} url composite url - can contain a single or multiple urls separated by ";"
 */
export const preloadUrl = url => {
    url =
        url || import.meta['env']?.SSR
            ? import.meta['env'].URL
            : window.location.pathname + window.location.search + window.location.hash

    const urls = Array.isArray(url) ? url : [url]
    return Promise.all(urls.map(url => preloadUrlFromUrlPairs(getUrlSegments(url))))
}
