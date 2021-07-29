<script>
    import { getContext, setContext } from 'svelte'
    export let node
    export let passthrough
    const context = getContext('routify-fragment-context') || {}
    context.node = node
    setContext('routify-fragment-context', context)
</script>

{#await node.rawComponent then rawComponent}
    <svelte:component this={rawComponent} {...passthrough} {context}>
        <slot />
    </svelte:component>
{/await}
