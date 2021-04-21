<script>
    import '../typedef.js'

    /** @type {RNode[]}*/
    export let nodes

    /** @type {RoutifyRuntime}*/
    export let instance

    $: [node, ...restNodes] = [...nodes]
</script>

<svelte:component this={node.component} {instance} {node}>
    {#if restNodes.length}
        <svelte:self nodes={restNodes} />
    {/if}
</svelte:component>
