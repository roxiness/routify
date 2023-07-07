import { resolveIfAnonFn, waitFor } from '../../utils/index.js'
import { scrollQueue } from './ScrollQueue.js'

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
        !boundaryElements.includes(element) &&
        !element.dataset.hasOwnProperty('routifyScrollLock')
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

const backupScrollBehavior = elem => {
    elem.oldBehavior = elem.oldBehavior || elem.style.scrollBehavior
}

const restoreScrollBehavior = elem => {
    if (elem.oldBehavior) elem.style.scrollBehavior = elem.oldBehavior
    else elem.style.removeProperty('scroll-behavior')

    delete elem.oldBehavior
}

/**
 * @param {HTMLElement} elem
 * @param {boolean} instant
 */
export const handleScrollInstructions = async (elem, callback, instant) => {
    const ancestors = getAllAncestors(elem)
    ancestors.forEach(backupScrollBehavior)

    if (instant) ancestors.forEach(ancestor => (ancestor.style.scrollBehavior = 'auto'))

    const observer = observeDocument(() => callback(elem, instant), true)
    const timeout = instant ? 300 : 0
    // todo observer.disconnect() should be called when route and all components have been rendered.
    setTimeout(() => {
        observer.disconnect()
        ancestors.forEach(restoreScrollBehavior)
    }, timeout)
    return waitForScrollToComplete(elem)
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

// TODO move waitForScrollToComplete
/**
 * watches an element position relative to the viewport and waits for it to stop moving.
 * @param {HTMLElement} elem
 */
function waitForScrollToComplete(elem) {
    let counter = 0
    let lastPos = null

    return new Promise(resolve => {
        requestAnimationFrame(checkPos)
        function checkPos() {
            //
            const { top, left } = elem.getBoundingClientRect()
            const newPos = top + '/' + left
            counter++
            // if the position isn't moving and we've checked 3 times.
            // We have to check 3 times to account for race conditions where the scroll is delayed.
            if (newPos === lastPos && counter > 2) {
                resolve()
            } else {
                lastPos = newPos
                requestAnimationFrame(checkPos)
            }
        }
    })
}

/**
 *
 * @param {RenderContext} context
 */
export const scrollToContext = async context => {
    // if there are no pending instructions, we are on a new route
    if (!scrollQueue.pendingInstructions) scrollQueue.destroy()
    scrollQueue.pendingInstructions++

    const [{ anchor, parent }, scrollBoundary] = await Promise.all([
        waitFor(context.elem, Boolean),
        context.scrollBoundary,
    ])

    const scrollTarget = anchor || parent

    const hashElem =
        context.route?.hash && globalThis.document?.getElementById(context.route?.hash)

    const elem =
        hashElem || (await resolveIfAnonFn(scrollTarget, [context, scrollBoundary]))
    const boundary = await resolveIfAnonFn(scrollBoundary, [context, scrollTarget])

    const scrollToPos = context.isInline || context.route?.hash
    const isInstant = !context.wasVisible || context.route?.state.dontsmoothscroll

    if (!elem) return

    if (scrollToPos) {
        scrollQueue.pushAsync(
            () =>
                handleScrollInstructions(elem, context.inline.scrollIntoView, isInstant),
            elem,
        )
    } else scrollToTop(elem, boundary)

    scrollQueue.pendingInstructions--
    if (!scrollQueue.pendingInstructions) scrollQueue.processQueue()
}

// TODO move getAllancestor
/**
 *
 * @param {HTMLElement} elem
 * @returns
 */
export const getAllAncestors = elem => {
    const ancestors = []
    let parent = elem.parentElement
    while (parent) {
        ancestors.push(parent)
        parent = parent.parentElement
    }
    return ancestors
}
