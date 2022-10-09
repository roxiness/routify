import { get } from 'svelte/store'
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
    const observer = new MutationObserver(() => {
        // console.log('DOM changed. Update scroll position')
        scopedScrollIntoView(el, limits)
    })
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

/** @param {HTMLElement} elem */
const getMulti = elem => {
    if (!elem) return false
    if (elem['__routify_meta']?.router) return false
    if (elem['__routify_meta']?.renderContext?.single)
        return !get(elem['__routify_meta']?.renderContext?.single)
    else return !getMulti(elem.parentElement)
}

/**
 *
 * @param {HTMLElement} elem
 * @param {HTMLElement[]=} limits
 */
export const scopedScrollIntoView = (elem, limits) => {
    limits = limits || getScrollBoundaries()

    let parent = elem.parentElement
    while (parent?.scrollTo && !limits.includes(parent)) {
        const targetRect = elem.getBoundingClientRect()
        const parentRect = parent.getBoundingClientRect()

        const top = targetRect.top - parentRect.top
        const left = targetRect.left - parentRect.left

        // console.log('scrolling', top, left, 'from', parent, 'to', elem)

        parent.scrollTo({ top, left })

        /**
         * If this is a not a multi page, we want to scroll it into view in its parent element.
         * If this is a multi page, we want want to scroll it into view of the nearest non multi ancestor element.
         */
        if (!getMulti(elem)) elem = parent

        parent = parent.parentElement
    }
}
