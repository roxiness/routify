<script>
    import { getContext, setContext } from 'svelte'
    export let node
    export let passthrough
    const CTX = 'routify-fragment-context'

    const context = { ...getContext(CTX), node }
    setContext(CTX, context)

    let Component
    if (node.module) node.getRawComponent().then(r => (Component = r))
</script>

{#if node.module}
    {#if Component}
        <Component {...passthrough} {context}>
            <slot />
        </Component>
    {/if}
{:else}
    <slot />
{/if}
