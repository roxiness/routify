<script context="module">
    import { get } from 'svelte/store'
    import { throttle } from '../../common/utils.js'
    import { scopedScrollIntoView, persistentScrollTo } from '../helpers/scroll.js'

    /** @typedef {{elem: HTMLElement, context: import('../renderer/types').RenderContext}} ElementHolder */

    /**
     * @type {Map<Router, ScrollHandler>}
     */
    const scrollHandlers = new Map()

    /** @param {Router} router */
    const fetchScrollHandler = router => {
        if (!scrollHandlers.has(router))
            scrollHandlers.set(router, new ScrollHandler(router))
        return scrollHandlers.get(router)
    }

    // todo life cycle scroll to -> persistent scroll to -> watch scroll
    class ScrollHandler {
        /** @param {Router} router */
        constructor(router) {
            this.router = router
            this.stopPersistent = () => null
            this.listenForScroll = true
            if (typeof document !== 'undefined') {
                addEventListener('scroll', () => this.onScroll(), { capture: true })
            }

            router.activeRoute.subscribe(async route => {
                if (route.state.dontScroll) return

                const parentElem = await route.leaf.parentElem
                const anchor = route.anchor && document.getElementById(route.anchor)
                const elem = anchor || parentElem
                this.scrollTo(elem, anchor, true)
            })
        }

        /** @param {HTMLElement} elem */
        scrollTo(elem, anchor, shouldPersist) {
            this.listenForScroll = false
            setTimeout(() => (this.listenForScroll = true), 500)
            setTimeout(async () => {
                scopedScrollIntoView(elem, anchor)

                if (shouldPersist) {
                    this.stopPersistent() // cancel last scroll
                    this.stopPersistent = persistentScrollTo(elem, anchor, {})
                    setTimeout(this.stopPersistent, 500)
                }
            })
        }

        onScroll() {
            throttle(async () => {
                this._onScrollThrottled()
                await new Promise(resolve => setTimeout(resolve, 100))
            })
        }

        _onScrollThrottled() {
            if (!this.listenForScroll) return

            let candidateElement
            let candidateTop = -Infinity

            // get elements that are "multi" pages or modules
            const renderElements = [...document.querySelectorAll('*')].filter(x => {
                const ctx = x['__routify_meta']?.renderContext
                return ctx && get(ctx.single) === false
            })

            // get the highest element that's not above the cutoff
            const cutoff = window.innerHeight / 3
            for (const element of renderElements) {
                const { top } = element.getBoundingClientRect()
                if (
                    cutoff > top &&
                    (top > candidateTop ||
                        element['__routify_meta'].renderContext.node.ancestors.includes(
                            candidateElement['__routify_meta'].renderContext.node,
                        ))
                ) {
                    candidateElement = element
                    candidateTop = top
                }
            }

            // if there's a candidate and it's not the current active route, set it as active
            if (candidateElement) {
                const context = candidateElement['__routify_meta'].renderContext
                if (context.router.activeRoute.get() != context.route)
                    context.router.url.set(context.node.path, 'replaceState', true, {
                        // we got to this route by scrolling manually, so we don't want the router to do any scrolling
                        dontScroll: true,
                    })
            }
        }
    }
</script>

<script>
    /** @type {import('../renderer/types').RenderContext} */
    export let context

    const { router } = context

    // assign one scrollHandler per router
    fetchScrollHandler(router)
</script>

<slot />
