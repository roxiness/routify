import { ScrollContext } from './ScrollContext.js'
import { scrollQueue } from './ScrollQueue.js'

/**
 *
 * @param {RenderContext} context
 */
export const scrollToContext = async context => {
    const scrollContext = new ScrollContext(context)
    await scrollContext.init()

    if (!scrollContext.elem) void 0
    else if (scrollContext.shouldScrollToElem) {
        scrollQueue.push(scrollContext)
    } else scrollToTop(scrollContext.elem, scrollContext.boundary)
}

/**
 *
 * @param {HTMLElement} elem
 * @param {HTMLElement} boundary
 */
export const scrollToTop = (elem, boundary) => {
    let parent = elem.parentElement
    while (parent && boundary !== parent) {
        const oldBehavior = parent.style.scrollBehavior

        // override scroll behavior of the element to make it scroll instantly
        parent.style.scrollBehavior = 'auto'
        parent.scrollTo(0, 0)
        parent.style.scrollBehavior = oldBehavior

        parent = parent.parentElement
    }
}
