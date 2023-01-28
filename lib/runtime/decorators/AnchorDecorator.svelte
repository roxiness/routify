<script>
    import { onMount as _onMount } from 'svelte'

    /** @type {import('./AnchorDecorator').Location}*/
    export let location

    /** @type {(parent: Node, anchor?: Node)=>any} */
    export let onMount = x => x

    /** @type {HTMLElement} */
    let elem

    let mounted = false

    /** @param {HTMLElement} elem */
    const nextValidSibling = elem => {
        const next = /** @type {HTMLElement}*/ (elem.nextElementSibling)
        return next && 'routifyAnchorLocator' in next.dataset
            ? nextValidSibling(next)
            : next
    }

    _onMount(async () => {
        if (location === 'wrapper') onMount(elem)
        else if (location === 'parent') onMount(elem.parentNode)
        else if (location === 'header') onMount(elem.parentElement, elem)
        else if (location === 'firstChild') {
            const nextSib = nextValidSibling(elem)
            onMount(elem.parentElement, nextSib)
        } else throw new Error(`Incorrect location provided. Got ${location}`)
        mounted = true // only works if firstchild is synchronous
    })
</script>

{#if location === 'wrapper'}
    <div bind:this={elem} {...$$restProps}>
        <slot />
    </div>
{:else if location === 'header'}
    <div bind:this={elem} {...$$restProps} />
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
    <!-- todo make backstop sibling here to ensure next sibling doesn't belong to the parent scope -->
{/if}
