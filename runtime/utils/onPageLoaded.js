import { currentLocation, handleScroll } from './index'


export async function onPageLoaded({ page, metatags, afterPageLoad, parentNode }) {
    //scroll needs to run after page load
    const scrollToTop = page.last !== page
    setTimeout(() => handleScroll(parentNode, scrollToTop))

    const { path } = page
    const { options } = currentLocation()
    const prefetchId = options.prefetch

    for (const hook of afterPageLoad._hooks) {
        // deleted/invalidated hooks are left as undefined
        if (hook) await hook(page.api)
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
