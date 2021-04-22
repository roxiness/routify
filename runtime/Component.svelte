<script>
    import '../typedef.js'

    /** @type {PathNode[]}*/
    export let pathNodes

    /** @type {RoutifyRuntime}*/
    export let instance

    $: [pathNode, ...restpathNodes] = [...pathNodes]
    $: node = pathNode.node
</script>

<svelte:component this={pathNode.node.component} {instance} {node}>
    {#if restpathNodes.length}
        <svelte:self pathNodes={restpathNodes} {instance} />
    {/if}
</svelte:component>
