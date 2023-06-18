<script>
    import { onMount as _onMount } from 'svelte'

    /** @type {import('./AnchorDecorator').Location}*/
    export let location

    /** @type {(parent: Node, anchor?: Node)=>any} */
    export let onMount = x => x

    /** @type {RenderContext} */
    export let context

    /** @type {HTMLElement} */
    let elem

    let mounted = false

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

    _onMount(async () => {
        if (mounted) return
        if (location === 'wrapper') onMount(elem)
        else if (location === 'parent') onMount(elem.parentElement)
        else if (location === 'header') onMount(elem.parentElement, elem)
        else if (location === 'firstChild') {
            const nextSib = nextValidSibling(elem)
            onMount(elem.parentElement, nextSib)
        } else throw new Error(`Incorrect location provided. Got ${location}`)
        mounted = true // only works if firstchild is synchronous
    })
</script>

{#if location === 'wrapper'}
    <div data-routify-anchor-parent bind:this={elem} {...$$restProps}>
        <slot />
    </div>
{:else if location === 'header'}
    <div data-routify-anchor-header bind:this={elem} {...$$restProps} />
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
