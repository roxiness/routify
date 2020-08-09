
export async function onPageLoaded({ page, metatags, afterPageLoad }) {
    const { path } = page
    const prefetchMatch = window.location.search.match(/__routify_prefetch=(\d+)/)
    const prefetchId = prefetchMatch && prefetchMatch[1]

    for (const hook of afterPageLoad._hooks) {
        await hook(page.api)
    }

    metatags.update()

    dispatchEvent(new CustomEvent('app-loaded'))
    parent.postMessage({
        msg: 'app-loaded',
        prefetched: window.routify.prefetched,
        path,
        prefetchId
    }, "*")
    window['routify'].appLoaded = true
    window['routify'].stopAutoReady = false
}
