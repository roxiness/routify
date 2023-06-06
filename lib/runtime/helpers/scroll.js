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

export const observeDocument = (callback, runOnInit, timeout) => {
    if (runOnInit) callback()

    new ResizeObserver(() => {})
    const observer = new MutationObserver(mutations => {
        const mutationsHasAddedOrRemovedANode = mutations.some(
            mutation =>
                mutation.type === 'childList' || mutation.type === 'characterData',
        )

        if (mutationsHasAddedOrRemovedANode) callback()
    })
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
    })
    if (timeout) setTimeout(() => observer.disconnect(), timeout)
    return observer
}

/**
 * Finds the next scrollable ancestor of an element within a specified boundary element.
 *
 * @param {HTMLElement} element - The element to find the next scrollable ancestor of.
 * @param {HTMLElement[]} boundaryElements - The element to stop searching for ancestors at.
 * @return {HTMLElement|null} The scrollable ancestor if found, otherwise null.
 */
function findNextScrollableAncestor(element, boundaryElements = []) {
    // Define a function to check if an element can be scrolled
    const isScrollable = elem =>
        elem.scrollWidth > elem.clientWidth || elem.scrollHeight > elem.clientHeight

    // Check if the parent element exists, is not a boundary element, and is not locked for scrolling
    if (
        element.parentElement &&
        !boundaryElements.includes(element.parentElement) &&
        element.parentElement['routifyScroll'] !== 'lock'
    ) {
        // Check if the parent element can be scrolled or if it is the document element
        if (
            isScrollable(element.parentElement) ||
            element.parentElement === document.documentElement
        ) {
            // Return the parent element if it can be scrolled
            return element.parentElement
        } else {
            // Recursively search for the next scrollable ancestor
            return findNextScrollableAncestor(element.parentElement, boundaryElements)
        }
    } else {
        // Return null if no scrollable ancestor is found
        return null
    }
}

/** @param {HTMLElement} elem */
const getMulti = elem => {
    if (!elem || elem['__routify_meta']?.router) return false

    const anchorInline = elem['__routify_meta']?.renderContext?.anchor?.isInline
    const parentInline = elem['__routify_meta']?.renderContext?.parent?.isInline

    return anchorInline ?? parentInline ?? getMulti(elem.parentElement)
}

/**
 * @param {HTMLElement} elem
 * @param {boolean} instant
 */
export const scrollIntoView = (elem, instant) => {
    const parent = findNextScrollableAncestor(elem)
    if (parent) {
        const oldBehavior = parent?.style.scrollBehavior
        if (instant) parent.style.scrollBehavior = 'auto'
        const observer = observeDocument(() => elem.scrollIntoView(), true)
        setTimeout(() => {
            observer.disconnect()
            parent.style.scrollBehavior = oldBehavior
        }, 200)
    }
}

/**
 *
 * @param {HTMLElement} elem
 * @param {HTMLElement} boundary
 */
export const scrollToTop = (elem, boundary) => {
    let parent = findNextScrollableAncestor(elem, [boundary])

    while (parent) {
        const oldBehavior = parent.style.scrollBehavior

        // override scroll behavior of the element to make it scroll instantly
        parent.style.scrollBehavior = 'auto'
        parent.scrollTo(0, 0)
        parent.style.scrollBehavior = oldBehavior

        parent = findNextScrollableAncestor(parent, [boundary])
    }
}

/**
 *
 * @param {RenderContext} context
 */
export const scrollToContext = async context => {
    const [{ anchor, parent }, scrollBoundary] = await Promise.all([
        waitFor(context.elem, Boolean),
        context.scrollBoundary,
        context.parentContext && waitFor(context.parentContext.elem, Boolean),
    ])

    const scrollTarget = anchor || parent

    const elem = await resolveIfAnonFn(scrollTarget, [context, scrollBoundary])
    const boundary = await resolveIfAnonFn(scrollBoundary, [context, scrollTarget])

    const scrollToPos = context.isInline || elem['routify-hash-nav']
    const oldAndNewContextAreBothInline =
        context.isInline && context.parentContext?.lastActiveChild?.isInline

    if (scrollToPos) scrollIntoView(elem, !oldAndNewContextAreBothInline)
    else scrollToTop(elem, boundary)
}
