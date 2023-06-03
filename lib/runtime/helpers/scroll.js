import { get } from 'svelte/store'
import { appInstance } from '../index.js'
import { resolveIfAnonFn, waitFor } from '../utils/index.js'

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
 * Finds the next scrollable ancestor of an element within a specified boundary element.
 *
 * @param {HTMLElement} element - The element to find the next scrollable ancestor of.
 * @param {HTMLElement} boundaryElement - The element to stop searching for ancestors at.
 * @return {HTMLElement|null} The scrollable ancestor if found, otherwise null.
 */
function findNextScrollableAncestor(element, boundaryElement) {
    // Function to check if an element is scrollable
    function isScrollable(elem) {
        return (
            elem.scrollHeight > elem.clientHeight &&
            (window.getComputedStyle(elem).overflowY === 'auto' ||
                window.getComputedStyle(elem).overflowY === 'scroll' ||
                elem === document.documentElement)
        )
    }

    // If the element has a parent and the parent is scrollable, return the parent
    // Otherwise, if the element has a parent, recur with the parent
    // Otherwise, return null
    if (
        element.parentElement &&
        element.parentElement !== boundaryElement &&
        element.parentElement['routifyScroll'] !== 'lock'
    ) {
        if (isScrollable(element.parentElement)) {
            return element.parentElement
        } else {
            return findNextScrollableAncestor(element.parentElement, boundaryElement)
        }
    } else {
        return null
    }
}

/** @param {HTMLElement} elem */
const getMulti = elem => {
    if (!elem || elem['__routify_meta']?.router) return false

    const anchorInline = get(elem['__routify_meta']?.renderContext?.anchor?.isInline)
    const parentInline = get(elem['__routify_meta']?.renderContext?.parent?.isInline)

    return anchorInline ?? parentInline ?? getMulti(elem.parentElement)
}

/**
 *
 * @param {HTMLElement | ((elem: HTMLElement)=>HTMLElement)} _elem
 * @param {scrollBoundary} _boundary
 */
export const scopedScrollIntoView = async (_elem, _boundary) => {
    let elem = await resolveIfAnonFn(_elem, [_boundary])
    const boundary = await resolveIfAnonFn(_boundary, [elem])
    const scrollToPos = getMulti(elem) || elem['routify-hash-nav']

    if (scrollToPos) {
        elem.scrollIntoView()
    } else {
        let parent = findNextScrollableAncestor(elem, boundary)
        while (parent?.scrollTo) {
            parent.scrollTo(0, 0)
            elem = parent
            parent = findNextScrollableAncestor(parent, boundary)
        }
    }
}

/**
 *
 * @param {RenderContext} context
 */
export const scrollToContext = async context => {
    const { anchor, parent } = await waitFor(context.elem, Boolean)
    const scrollTarget = anchor || parent

    let scrollBoundary = await context.scrollBoundary

    scopedScrollIntoView(scrollTarget, scrollBoundary)
}
