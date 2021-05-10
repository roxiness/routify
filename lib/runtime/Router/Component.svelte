<script>
    import { getContext, setContext } from 'svelte'

    import '#typedef'

    /** @type {RouteFragment}*/
    export let fragments

    /** @type {import('svelte/store').Readable<Route>}*/
    export let route

    $: [fragment, ...restFragments] = [...fragments]
    $: node = fragment.node
    $: payload = {
        route,
        node,
        localParams: fragment.params,
    }
    $: setContext('routify-component', payload)
</script>

{#if restFragments.length}
    <svelte:component this={fragment.node.component} {payload}>
        <svelte:self fragments={restFragments} {route} />
    </svelte:component>
{:else}
    <svelte:component this={fragment.node.component} {payload} />
{/if}
