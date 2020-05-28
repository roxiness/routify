import { metatags } from "../helpers"

export function onAppLoaded({ path }) {
    metatags.update()
    const prefetchMatch = window.location.search.match(/__routify_prefetch=(\d+)/)
    const prefetchId = prefetchMatch && prefetchMatch[1]

    dispatchEvent(new CustomEvent('app-loaded'))
    parent.postMessage({
        msg: 'app-loaded',
        prefetched: window.routify.prefetched,
        path,
        prefetchId
    }, "*")
    window['routify'].appLoaded = true
}
