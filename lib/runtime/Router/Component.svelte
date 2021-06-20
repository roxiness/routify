<script>
    import { setContext } from 'svelte'
    import '#root/typedef.js'

    /** @type {RouteFragment}*/
    export let fragments

    $: [fragment, ...restFragments] = [...fragments]
    $: ({ node, load, route, params } = fragment)
    $: payload = { route, node, load, localParams: params }
    $: setContext('routify-component', payload)
</script>

{#if restFragments.length}
    <svelte:component this={fragment.node.component.default} {payload}>
        <svelte:self fragments={restFragments} {route} {...load} />
    </svelte:component>
{:else}
    <svelte:component this={fragment.node.component.default} {payload} {...load} />
{/if}
