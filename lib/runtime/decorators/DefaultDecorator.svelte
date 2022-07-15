<script context="module">
    import { get } from 'svelte/store'
    import { persistentScrollTo } from '../helpers'

    /** @typedef {{elem: HTMLElement, context: import('../Router/types').RenderContext}} ElementHolder */

    /** @type {HTMLElement} */
    let targetElem

    let stopPersistent = () => null
    /** @type {ElementHolder[]} */
    const elemHolders = []

    /** @param {HTMLElement} elem */
    const scrollTo = (elem, shouldPersist) => {
        // if no scroll action doesn't exist already, start one
        if (!targetElem)
            setTimeout(async () => {
                console.log('scroll to', shouldPersist, targetElem)
                targetElem.scrollIntoView()
                if (shouldPersist) {
                    stopPersistent = persistentScrollTo(targetElem, {})
                    setTimeout(stopPersistent, 500)
                }
                targetElem = null
            })
        targetElem = elem
    }

    let watchingScroll = false
    const watchScroll = () => {
        if (watchingScroll) return
        watchingScroll = true
        document.addEventListener('scroll', onScroll)
    }

    let isHandlingScroll = false
    const onScroll = () => {
        if (isHandlingScroll) return
        isHandlingScroll = true

        const cutoff = window.innerHeight / 3
        /** @type {ElementHolder}*/
        let candidateElementHolder
        let candidateTop = -Infinity
        for (const elementHolder of elemHolders) {
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
            if (context.router.activeRoute.get() === context.route) {
            } else {
                // console.log('r', context.route)
                // console.log('ar', context.router.activeRoute.get())
                // console.log(elemHolders)
                context.router.url.set(context.node.path, 'replaceState', true, {
                    dontScroll: true,
                })
            }
        }
        isHandlingScroll = false
    }
</script>

<script>
    /** @type {import('../Router/types').RenderContext} */
    export let context
    export let Parent

    let counter = 0

    setInterval(() => {
        counter = counter + 1
    }, 500)

    const { isActive, single } = context

    /** @type {HTMLElement} */
    let elem

    $: if ($isActive && elem && !context.route.state.dontScroll) scrollTo(elem)

    const init = el => {
        if (!get(context.single)) {
            elem = el
            const elemHolder = { elem, context }
            elemHolders.push(elemHolder)
            context.onDestroy(() => {
                console.log('remove', elemHolder.elem)
                elemHolders.splice(elemHolders.indexOf(elemHolder), 1)
            })

            setTimeout(() => {
                if ($isActive && !$single && !context.route.state.dontScroll) {
                    const lastNode = [...context.route.fragments].pop().node
                    if (lastNode === elemHolder.context.node) scrollTo(elem, true)
                }
            })
            setTimeout(watchScroll, 1000)
        }
    }
</script>

<div
    use:init
    class="decorator-{context.node.id}"
    style="position: relative; top:-200px" />
<div>
    count: {counter}
</div>
<slot />
