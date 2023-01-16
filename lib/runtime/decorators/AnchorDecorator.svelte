<script>
    /** @typedef {import('./AnchorDecorator').Location} Location */

    /** @type {Location}*/
    export let location
    /** @type {Node} */
    let elem
    /** @type {(parent: Node, anchor?: Node)=>any} */
    export let onMount = x => x

    /**
     * @param {Node} elem
     */
    const setElem = elem => {
        const { parent, anchor } = getTarget(location, elem)
        onMount(parent, anchor)
    }

    /**
     * @param {location} location
     * @param {Node} elem
     */
    const getTarget = (location, elem) => {
        if (location === 'wrapper') return { parent: elem }
        if (location === 'parent') return { parent: elem.parentNode }
        if (location === 'header') return { parent: elem.parentElement, anchor: elem }
        if (location === 'firstChild')
            return { parent: elem.parentElement, anchor: elem.nextSibling }
        throw new Error(`Incorrect location provided. Got ${location}`)
    }
</script>

{#if location === 'wrapper'}
    <div use:setElem {...$$restProps}>
        <slot />
    </div>
{:else if location === 'header'}
    <div use:setElem {...$$restProps} />
    <slot />
{:else}
    {#if !elem}
        <div use:setElem {...$$restProps} />
    {/if}
    <slot />
    <!-- todo make backstop sibling here to ensure next sibling doesn't belong to the parent scope -->
{/if}
