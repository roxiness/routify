export const getNearestScrollLock = elem => {
    const parent = elem.parentElement
    if (!parent) return null
    if (parent.dataset.hasOwnProperty('routifyScrollLock')) return parent
    return getNearestScrollLock(parent)
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
