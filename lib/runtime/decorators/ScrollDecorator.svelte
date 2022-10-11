<script context="module">
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
            /** @type {ElementHolder[]} */
            this.elemHolders = []
            if (typeof document !== 'undefined')
                document.addEventListener('scroll', () => this.onScroll())
        }

        /**
         * @param {HTMLElement} elem
         * @param {import('../renderer/types').RenderContext} context
         */
        registerRenderContext(elem, context) {
            const elemHolder = { elem, context }
            this.elemHolders.push(elemHolder)
            context.onDestroy(() =>
                this.elemHolders.splice(this.elemHolders.indexOf(elemHolder), 1),
            )
        }

        /** @param {HTMLElement} elem */
        scrollTo(elem, shouldPersist) {
            setTimeout(async () => {
                scopedScrollIntoView(elem)

                if (shouldPersist) {
                    this.stopPersistent() // cancel last scroll
                    this.stopPersistent = persistentScrollTo(elem, {})
                    setTimeout(this.stopPersistent, 500)
                }
            })
        }

        onScroll() {
            const cutoff = window.innerHeight / 3
            /** @type {ElementHolder}*/
            let candidateElementHolder
            let candidateTop = -Infinity
            for (const elementHolder of this.elemHolders) {
                const { top } = elementHolder.elem.getBoundingClientRect()
                if (
                    cutoff > top &&
                    (top > candidateTop ||
                        elementHolder.context.node.ancestors.includes(
                            candidateElementHolder.context.node,
                        ))
                ) {
                    candidateElementHolder = elementHolder
                    candidateTop = top
                }
            }
            if (candidateElementHolder) {
                const { context, elem } = candidateElementHolder
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

    const { isActive, single, router, route, node } = context
    const isLeafFragment = () => context.node.id === context.route?.leaf.node.id

    // assign one scrollHandler per router
    const scrollHandler = fetchScrollHandler(router)

    /** @type {HTMLElement} */
    let elem

    $: if (
        $isActive &&
        elem &&
        !context.options?.noScroll &&
        !context.route.state.dontScroll &&
        isLeafFragment()
    )
        scrollHandler.scrollTo(elem, true)

    /** @param {HTMLElement} el */
    const init = el => {
        elem = el.parentElement
        scrollHandler.registerRenderContext(elem, context)
    }
</script>

{#if !elem}
    <div use:init />
{/if}

<slot />
