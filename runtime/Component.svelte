<script>
    import '../typedef.js'

    /** @type {RouteFragment}*/
    export let fragments

    /** @type {RoutifyRuntime}*/
    export let instance

    $: [fragment, ...restFragments] = [...fragments]
    $: node = fragment.node
    $: payload = { instance, node, localParams: fragment.params }
</script>

{#if restFragments.length}
    <svelte:component this={fragment.node.component} {payload}>
        <svelte:self fragments={restFragments} {instance} />
    </svelte:component>
{:else}
    <svelte:component this={fragment.node.component} {payload} />
{/if}
