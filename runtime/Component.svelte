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

{#if restpathNodes.length}
    <svelte:component this={pathNode.node.component} {payload}>
        <svelte:self pathNodes={restpathNodes} {instance} />
    </svelte:component>
{:else}
    <svelte:component this={pathNode.node.component} {payload} />
{/if}
