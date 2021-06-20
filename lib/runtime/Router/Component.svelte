<script>
    import { setContext } from 'svelte'
    import '#root/typedef.js'

    /** @type {RouteFragment[]}*/
    export let fragments

    $: [fragment, ...restFragments] = [...fragments]
    $: ({ node, load, route, params } = fragment)
    $: context = { route, node, load, localParams: params }
    $: setContext('routify-fragment-context', context)
</script>

{#if restFragments.length}
    <svelte:component this={fragment.node.component.default} {context}>
        <svelte:self fragments={restFragments} {route} {...load} />
    </svelte:component>
{:else}
    <svelte:component this={fragment.node.component.default} {context} {...load} />
{/if}
