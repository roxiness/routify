<script context="module">
    import { get } from 'svelte/store'
    import { getPath, goto, persistentScrollTo } from '../helpers'
    import { populateUrl } from '../utils'

    /** @typedef {{elem: HTMLElement, context: import('../Router/types').RenderContext}} ElementHolder */

    /** @type {HTMLElement} */
    let targetElem
    let persist = false
    let watchingScroll = false
    /** @type {ElementHolder[]} */
    const elemHolders = []
    console.log({ elemHolders })
    window.elemHolders = elemHolders

    /** @param {HTMLElement} elem */
    const scrollTo = (elem, _persist) => {
        persist = _persist || persist
        if (!targetElem) {
            setTimeout(() => {
                targetElem.scrollIntoView()
                if (persist) {
                    console.log('persist to', targetElem)
                    persistentScrollTo(targetElem, {}, 500)
                }
                targetElem = null
            })
        }
        targetElem = elem
    }

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
                console.log('r', context.route)
                console.log('ar', context.router.activeRoute.get())
                console.log(elemHolders)
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
                    console.log('scrolling to', elem)
                    scrollTo(elem, true)
                }
            }, 1000)
            setTimeout(watchScroll, 1500)
        }
    }
</script>

<div use:init class="decorator-{context.node.id}" style="" />
<div>
    count: {counter}
</div>
<slot />
