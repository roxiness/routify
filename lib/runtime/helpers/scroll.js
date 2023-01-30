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
    if (elem['__routify_meta']?.renderContext?.anchor?.single)
        return !get(elem['__routify_meta']?.renderContext?.anchor?.single)
    if (elem['__routify_meta']?.renderContext?.parent?.single)
        return !get(elem['__routify_meta']?.renderContext?.parent?.single)
    else return getMulti(elem.parentElement)
}

/**
 * Resolves the given `subject` as a function if it is anonymous, otherwise returns the subject as is
 * @template T
 * @template P
 * @param {T | ((...P)=>T) | ((...P)=>Promise<T>) } subject The subject to be resolved.
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
 * @param {scrollBoundary} _boundary
 */
export const scopedScrollIntoView = async (_elem, _boundary) => {
    let elem = await resolveIfAnonFn(_elem, [_boundary])
    const boundary = await resolveIfAnonFn(_boundary, [elem])
    // /** @type {any[]} */
    // const logs = [['[scroll] elem', elem, 'boundary', boundary]]

    let parent = elem.parentElement
    while (
        parent?.scrollTo &&
        parent.dataset['routifyScroll'] !== 'lock' &&
        parent !== boundary?.parentElement
    ) {
        const scrollToPos = getMulti(elem) || elem['routify-hash-nav']
        if (!scrollToPos) {
            parent.scrollTo(0, 0)
            // logs.push([' |', { parent: parent, child: _elem, top: true }])
        } else {
            const targetRect = elem.getBoundingClientRect()
            const parentRect = parent.getBoundingClientRect()

            // if parent is HTML, scroll and top is the same and we get double effect
            const scrollTop = parent.parentElement ? parent.scrollTop : 0
            const scrollLeft = parent.parentElement ? parent.scrollLeft : 0
            // const top = targetRect.top - parentRect.top
            // logs.push(['parent scrolltop ', parent.scrollTop])
            const top = scrollTop + targetRect.top - parentRect.top
            // const left = targetRect.left - parentRect.left
            const left = scrollLeft + targetRect.left - parentRect.left
            // logs.push([
            //     ' | ',
            //     {
            //         parent: parent,
            //         child: _elem,
            //         top,
            //         left,
            //         scrollTop: parent.scrollTop,
            //         targetTop: targetRect.top,
            //         parentTop: parentRect.top,
            //     },
            // ])
            parent.scrollTo({ top, left })
        }

        /**
         * If this is a not a multi page, we want to scroll it into view in its parent element.
         * If this is a multi page, we want want to scroll it into view of the nearest non multi ancestor element.
         */
        if (!scrollToPos) elem = parent

        parent = parent.parentElement
    }

    // logs.forEach(entry => console.log(...entry))
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
