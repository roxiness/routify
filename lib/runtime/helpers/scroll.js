import { get } from 'svelte/store'
import { appInstance } from '../index.js'
import { resolveIfAnonFn, waitFor } from '../utils/index.js'

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

/** @param {HTMLElement} elem */
const getMulti = elem => {
    if (!elem || elem['__routify_meta']?.router) return false

    const anchorInline = elem['__routify_meta']?.renderContext?.anchor?.isInline
    const parentInline = elem['__routify_meta']?.renderContext?.parent?.isInline

    return anchorInline ?? parentInline ?? getMulti(elem.parentElement)
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
export const scrollIntoView = async (elem, callback, instant) => {
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

export class ScrollIntoViewQueue {
    currentRoute

    /** @type {{elem: HTMLElement, callback: function, instant: boolean}[]} */
    queue = []

    /**
     * Adds an element to the queue with its respective callback function and instant flag.
     * If the ID is different from the current ID, clears the queue and starts processing it.
     * @param {HTMLElement} elem - The element to be added to the queue.
     * @param {function} callback - The callback function to execute.
     * @param {boolean} instant - Flag to indicate if the function should be executed immediately.
     * @param {Route} route - The identifier of the element being added.
     */
    push(elem, callback, instant, route) {
        // Adds element to the queue with its respective callback function and instant flag
        this.queue.push({ elem, callback, instant })

        // If the ID is different from the current ID, clears the queue and starts processing it.
        if (route != this.currentRoute) {
            this.currentRoute = route
            this.queue.splice(0, this.queue.length - 1)
            this.processQueue()
        }
    }

    /**
     * Processes the queue of elements and callbacks to execute them sequentially.
     * @return {Promise<void>} A promise that resolves when the entire queue has been processed.
     */
    async processQueue() {
        const initialId = this.currentRoute
        while (this.queue.length && initialId == this.currentRoute) {
            const { elem, callback, instant } = this.queue.shift()
            await this.runCallback(elem, callback, instant)
            if (!instant) await waitForScrollToComplete(elem)
        }
        // currentId should be null so that the next pushed element starts `processQueue`
        this.currentRoute = null
    }

    async runCallback(elem, callback, instant) {
        return new Promise(resolve => {
            const _callback = async (...params) => {
                await callback(...params)
                resolve()
            }
            scrollIntoView(elem, _callback, instant)
        })
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

let scrollIntoViewQueue = new ScrollIntoViewQueue()

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

    const hashElem =
        context.route?.hash && globalThis.document?.getElementById(context.route?.hash)

    const elem =
        hashElem || (await resolveIfAnonFn(scrollTarget, [context, scrollBoundary]))
    const boundary = await resolveIfAnonFn(scrollBoundary, [context, scrollTarget])

    const scrollToPos = context.isInline || context.route?.hash
    const isInstant =
        !context.isInline || context.isNew || context.route?.state.dontsmoothscroll

    if (!elem) return

    if (scrollToPos) {
        // scrollIntoView can't handle simultaneously scrolling two elements, so we need to queue it
        scrollIntoViewQueue.push(
            elem,
            context.inline.scrollIntoView,
            isInstant,
            context.route,
        )
    } else scrollToTop(elem, boundary)
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
