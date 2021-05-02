<script>
    import { getContext, setContext } from 'svelte'

    import '../../typedef.js'

    /** @type {RouteFragment}*/
    export let fragments

    export let options

    /** @type {import('svelte/store').Readable<Route>}*/
    export let route

    $: [fragment, ...restFragments] = [...fragments]
    $: node = fragment.node
    $: payload = {
        route,
        node,
        localParams: fragment.params,
        options,
    }
    $: setContext('routify-component', payload)
</script>

{#if restFragments.length}
    <svelte:component this={fragment.node.component} {payload} let:options>
        <svelte:self fragments={restFragments} {route} {options} />
    </svelte:component>
{:else}
    <svelte:component this={fragment.node.component} {payload} let:options />
{/if}
