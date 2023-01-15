<script>
    /** @typedef {import('./AnchorDecorator').Location} Location */

    /** @type {Location}*/
    export let location
    /** @type {Node} */
    let elem
    /** @type {(Node)=>any} */
    export let onMount = x => x

    /**
     * @param {Node} _elem
     */
    const setElem = _elem => {
        elem = _elem
        const targetElem = getTarget(location, elem)
        onMount(targetElem)
    }

    /**
     *
     * @param {location} location
     * @param {Node} elem
     */
    const getTarget = (location, elem) => {
        if (location === 'wrapper' || location === 'header') return elem
        if (location === 'parent') return elem.parentNode
        if (location === 'firstChild') return elem.firstChild
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
{/if}
