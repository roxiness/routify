import { globalInstance } from '../index.js'

/**
 * @type {import('./scroll')['persistentScrollTo']}
 * @param {HTMLElement} el
 * @param {ScrollIntoViewOptions} options
 * @param {number} timeout
 */
// @ts-ignore
export const persistentScrollTo = (el, options, timeout) => {
    options = options || {}
    options.behavior = 'auto'
    const limits = getScrollBoundaries()
    const observer = new MutationObserver(() => scopedScrollIntoView(el, limits))
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    })
    const stopScroll = () => observer.disconnect()

    if (timeout) {
        return new Promise(resolve =>
            setTimeout(() => {
                stopScroll()
                resolve()
            }, timeout),
        )
    } else {
        timeout
        return stopScroll
    }
}
/**
 * returns all the elements that should scrolling shouldn't propagate past, ie. routify-scroll=lock and router parent elements
 * @returns  {HTMLElement[]}
 */
export const getScrollBoundaries = () => [
    ...document.querySelectorAll('[data-routify-scroll="lock"]'),
    ...globalInstance.routers
        .filter(router => router.parentCmpCtx)
        .map(router => router.parentElem),
]

/**
 *
 * @param {HTMLElement} elem
 * @param {HTMLElement[]=} limits
 */
export const scopedScrollIntoView = (elem, limits) => {
    limits = limits || getScrollBoundaries()

    console.log('scoped scroll into vieew', limits)

    let parent = elem
    while (parent?.scrollTo && !limits.includes(parent)) {
        const targetRect = elem.getBoundingClientRect()
        const parentRect = parent.getBoundingClientRect()

        const top = targetRect.top - parentRect.top
        const left = targetRect.left - parentRect.left

        parent.scrollTo({ top, left })
        parent = parent.parentElement
    }
}
