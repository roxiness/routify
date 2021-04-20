<script>
    export let nodes
    $: [node, ...restNodes] = [...nodes]
</script>

<svelte:component this={node.component}>
    {#if restNodes.length}
        <svelte:self nodes={restNodes} />
    {/if}
</svelte:component>
