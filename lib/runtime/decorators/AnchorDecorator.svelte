<script>
    import { onMount as _onMount } from 'svelte'
    import { RenderContext } from '../renderer/RenderContext.js'

    /** @type {RouterContext|RenderContext} */
    export let context

    const location = context.anchorLocation

    /** @type {(parent: Node, anchor?: Node)=>any} */
    export let onMount = x => x

    /** @type {HTMLElement} */
    let elem

    let mounted = false

    // check if context is a routercontext
    const name =
        context instanceof RenderContext
            ? context.node.name || 'unnamed'
            : context.router.name || 'defaultRouter'

    /** @param {HTMLElement} elem */
    const nextValidSibling = elem => {
        const next = /** @type {HTMLElement}*/ (elem.nextElementSibling)
        if ('routifyAnchorBackstop' in next.dataset) {
            console.warn('found no children in', elem.parentElement)
            throw new Error(
                'AnchorLocation is set to firstChild, but no children were found',
            )
        }
        return next && 'routifyAnchorLocator' in next.dataset
            ? nextValidSibling(next)
            : next
    }

    const handlers = {
        wrapper: elem => {
            elem.dataset.routifyAnchorWrapper = name
            onMount(elem)
        },
        parent: elem => {
            elem.dataset.routifyAnchorParent = name
            onMount(elem.parentElement)
        },
        header: elem => {
            elem.dataset.routifyAnchorHeader = name
            onMount(elem.parentElement, elem)
        },
        firstChild: elem => {
            const nextSib = nextValidSibling(elem)
            nextSib.dataset.routifyAnchorNextSibling = name
            onMount(elem.parentElement, nextSib)
        },
        custom: elem => {
            // @ts-ignore location is a function
            const res = location(elem)
            res.dataset.routifyAnchorCustom = name
            if (res.dataset.hasOwnProperty('routifyAnchorLocator')) {
                const warn = `Selected anchor element is an anchor locator. Use '!elem.dataset.hasOwnProperty("routifyAnchorLocator")' to ensure a valid selection.`
                ;(context['node'] || context.router).log.warn(warn)
            }

            onMount(elem.parentElement, res)
        },
    }

    _onMount(() => {
        if (mounted) return
        const handlerName = typeof location === 'function' ? 'custom' : location
        const handler = handlers[handlerName]
        handler(elem)
        mounted = true // only works if firstchild is synchronous
    })
</script>

{#if location === 'wrapper'}
    <div data-routify-anchor-wrapper={name} bind:this={elem} {...$$restProps}>
        <slot />
    </div>
{:else if location === 'header'}
    <div data-routify-anchor-header={name} bind:this={elem} {...$$restProps} />
    <slot />
{:else}
    {#if !mounted}
        <div
            data-routify-anchor-locator
            class="anchor"
            bind:this={elem}
            {...$$restProps} />
    {/if}
    <slot />

    {#if !mounted} <div class="anchor-backstop" data-routify-anchor-backstop /> {/if}
{/if}
