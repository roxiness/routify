/**
 * Finds the next scrollable ancestor of an element within a specified boundary element.
 *
 * @param {HTMLElement} element - The element to find the next scrollable ancestor of.
 * @param {HTMLElement[]} boundaryElements - The element to stop searching for ancestors at.
 * @return {HTMLElement|null} The scrollable ancestor if found, otherwise null.
 */
export function findNextScrollableAncestor(element, boundaryElements = []) {
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

// TODO move waitForScrollToComplete
/**
 * watches an element position relative to the viewport and waits for it to stop moving.
 * @param {HTMLElement} elem
 */
export function waitForScrollToComplete(elem) {
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

export const backupScrollBehavior = elem => {
    elem.oldBehavior = elem.oldBehavior || elem.style.scrollBehavior
}

export const restoreScrollBehavior = elem => {
    if (elem.oldBehavior) elem.style.scrollBehavior = elem.oldBehavior
    else elem.style.removeProperty('scroll-behavior')

    delete elem.oldBehavior
}

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
