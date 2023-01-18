import { get } from 'svelte/store'
import { appInstance } from '../index.js'
import { waitFor } from '../utils/index.js'

/**
 * @param {HTMLElement | ((elem: HTMLElement)=>HTMLElement)} _elem
 * @param {HTMLElement | ((elem: HTMLElement)=>HTMLElement)} [_boundary]
 * @param {ScrollIntoViewOptions} [options]
 * @param {number} [timeout]
 */
// @ts-ignore
export const persistentScopedScrollIntoView = (_elem, _boundary, options, timeout) => {
    let elem = resolveIfAnonFn(_elem, [_boundary])
    const boundary = resolveIfAnonFn(_boundary, [elem])

    options = options || {}
    options.behavior = 'auto'
    scopedScrollIntoView(elem, boundary)
    const observer = new MutationObserver(mo => {
        // console.log('DOM changed. Update scroll position')
        if (mo.length > 1 || mo[0].addedNodes.length || mo[0].removedNodes.length) {
            scopedScrollIntoView(elem, boundary)
        }
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
    ...appInstance.routers
        .filter(router => router.parentCmpCtx)
        .map(router => router.parentElem),
]

/** @param {HTMLElement} elem */
const getMulti = elem => {
    if (!elem) return false
    if (elem['__routify_meta']?.router) return false
    if (elem['__routify_meta']?.renderContext?.single)
        return !get(elem['__routify_meta']?.renderContext?.single)
    else return getMulti(elem.parentElement)
}

/**
 * Resolves the given `subject` as a function if it is anonymous, otherwise returns the subject as is
 * @template T
 * @template P
 * @param {T | ((...P)=>T)} subject The subject to be resolved.
 * @param {P[]=} params An optional array of parameters to pass to the anonymous function.
 * @returns {T}
 */
export const resolveIfAnonFn = (subject, params) => {
    const isAnonFn = typeof subject === 'function' && !subject['prototype']
    return isAnonFn ? /** @type {any} */ (subject)(...params) : subject
}

/**
 *
 * @param {HTMLElement | ((elem: HTMLElement)=>HTMLElement)} _elem
 * @param {HTMLElement | ((elem: HTMLElement)=>HTMLElement)} _boundary
 */
export const scopedScrollIntoView = (_elem, _boundary) => {
    let elem = resolveIfAnonFn(_elem, [_boundary])
    const boundary = resolveIfAnonFn(_boundary, [elem])

    let parent = elem.parentElement
    console.log('elem', elem)
    while (
        parent?.scrollTo &&
        parent.dataset['routify-scroll'] !== 'lock' &&
        parent !== boundary
    ) {
        const scrollToPos = getMulti(elem) || elem['routify-hash-nav']
        if (!scrollToPos) {
            parent.scrollTo(0, 0)
        } else {
            const targetRect = elem.getBoundingClientRect()
            const parentRect = parent.getBoundingClientRect()

            const top = targetRect.top - parentRect.top
            const left = targetRect.left - parentRect.left
            parent.scrollTo({ top, left })
        }

        /**
         * If this is a not a multi page, we want to scroll it into view in its parent element.
         * If this is a multi page, we want want to scroll it into view of the nearest non multi ancestor element.
         */
        if (!scrollToPos) elem = parent

        parent = parent.parentElement
    }
}

/**
 *
 * @param {RenderContext} context
 */
export const scrollToContext = async context => {
    const { anchor, parent } = await waitFor(context.elem, Boolean)
    const scrollTarget = anchor || parent

    let scrollBoundary = await context.multi.scrollBoundary

    scopedScrollIntoView(scrollTarget, scrollBoundary)
}
