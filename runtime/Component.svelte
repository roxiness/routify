<script>
    import '../typedef.js'

    /** @type {PathNode[]}*/
    export let pathNodes

    /** @type {RoutifyRuntime}*/
    export let instance

    $: [pathNode, ...restpathNodes] = [...pathNodes]
    $: node = pathNode.node
    $: payload = { instance, node, localParams: pathNode.params }
</script>

<svelte:component this={pathNode.node.component} {payload}>
    {#if restpathNodes.length}
        <svelte:self pathNodes={restpathNodes} {instance} />
    {/if}
</svelte:component>
