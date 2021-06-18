<script>
    import { setContext } from 'svelte'
    import '#root/typedef.js'

    /** @type {RouteFragment}*/
    export let fragments

    /** @type {import('svelte/store').Readable<Route>}*/
    export let route

    $: [fragment, ...restFragments] = [...fragments]
    $: node = fragment.node
    $: load = fragment.load
    $: payload = {
        route,
        node,
        localParams: fragment.params,
    }
    $: setContext('routify-component', payload)
</script>

{#if restFragments.length}
    <svelte:component this={fragment.node.component.default} {payload}>
        <svelte:self fragments={restFragments} {route} {...load} />
    </svelte:component>
{:else}
    <svelte:component this={fragment.node.component.default} {payload} {...load} />
{/if}
