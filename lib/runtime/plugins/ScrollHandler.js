import { get } from 'svelte/store'
import { throttle } from '../../common/utils.js'

const defaultOptions = {
    coolOffTime: 500,
    throttleTime: 100,
    cutoff: 0,
    /** @type {'both' | 'vertical' | 'horizontal'} */
    direction: 'both',
}

/** @typedef {{elem: HTMLElement, context: RenderContext}} ElementHolder */

// todo on active renderFragment
// scroll top of fragment into view

// todo life cycle scroll to -> persistent scroll to -> watch scroll
export class ScrollHandler {
    /** @type {Route} */
    lastRoute

    /** @type {HTMLElement[]} */
    lastElems = []

    cutoff = 0

    direction

    /**
     * @param {Router} router
     * @param {Partial<defaultOptions>} options
     * */
    constructor(router, options = {}) {
        options = { ...defaultOptions, ...options }

        this.coolOffTime = options.coolOffTime
        this.throttleTime = options.throttleTime
        this.cutoff = options.cutoff
        this.direction = options.direction
        this.router = router
        this.onScrollIsActive = false
        this.stopPersistent = () => null
        this.listenForScroll = true
    }

    onScrollThrottled() {
        const route = this.router.activeRoute.get()
        throttle(async () => {
            const routeIsSettled = Date.now() - route?.state.createdAt > this.coolOffTime
            if (routeIsSettled || route?.state.dontScroll) this.onScroll()
            await new Promise(resolve => setTimeout(resolve, this.throttleTime))
        })
    }

    onScroll() {
        let candidateElement
        let candidateStartingPos = -Infinity

        if (this.router.activeRoute.get() !== this.lastRoute) {
            this.lastRoute = this.router.activeRoute.get()
            this.lastElems = this.router.context.descendants
                .map(context => {
                    const elem = get(context.elem)
                    if (context.isInline)
                        return elem?.anchor || elem?.parent
                })
                .filter(Boolean)
        }

        // get the highest element that's not above the cutoff
        for (const element of this.lastElems) {
            const { top, left } = element.getBoundingClientRect()
            const pos =
                this.direction === 'both'
                    ? top + left
                    : this.direction === 'vertical'
                    ? top
                    : left
            if (pos <= this.cutoff && pos >= candidateStartingPos) {
                candidateElement = element
                candidateStartingPos = pos
            }
        }

        // if there's a candidate and it's not the current active route, set it as active
        if (candidateElement) {
            const contexts = candidateElement['__routify_meta'].renderContext
            const context = contexts.anchor || contexts.parent
            if (context.router.activeRoute.get() != context.route)
                context.router.url.set(context.node.path, 'replaceState', true, {
                    // we got to this route by scrolling manually, so we don't want the router to do any scrolling
                    dontScroll: true,
                })
        }
    }
}
