import { getContext } from 'svelte'
import { get } from 'svelte/store'
import { throttle } from '../../common/utils.js'

const COOLOFF_TIME = 500
const THROTTLE_TIME = 100

/** @typedef {{elem: HTMLElement, context: RenderContext}} ElementHolder */

// todo on active renderFragment
// scroll top of fragment into view

// todo life cycle scroll to -> persistent scroll to -> watch scroll
export class ScrollHandler {
    /** @param {Router} router */
    constructor(router, coolOffTime = COOLOFF_TIME, throttleTime = THROTTLE_TIME) {
        this.coolOffTime = coolOffTime
        this.throttleTime = throttleTime
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
        let candidateTop = -Infinity

        // get elements that are "multi" pages or modules
        const renderElements = [...document.querySelectorAll('*')].filter(x => {
            const contexts = x['__routify_meta']?.renderContext
            const context = contexts?.anchor || contexts?.parent
            return context?.router === this.router && get(context.single) === false
        })

        // get the highest element that's not above the cutoff
        const cutoff = window.innerHeight / 3
        for (const element of renderElements) {
            const { top } = element.getBoundingClientRect()
            if (top < cutoff && top > candidateTop) {
                candidateElement = element
                candidateTop = top
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
