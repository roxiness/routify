<script>
    import { setContext } from 'svelte'
    import '#root/typedef.js'

    /** @type {RouteFragment[]}*/
    export let fragments

    export let props

    $: [fragment, ...restFragments] = [...fragments]
    $: ({ node, load, route, params } = fragment)
    $: context = { route, node, load, localParams: params }
    $: setContext('routify-fragment-context', context)
</script>

{#if restFragments.length}
    <svelte:component
        this={fragment.node.component.default}
        {context}
        {...props}
        let:props>
        <svelte:self fragments={restFragments} {route} {...load} {props} />
    </svelte:component>
{:else}
    <svelte:component
        this={fragment.node.component.default}
        {context}
        {...load}
        {...props} />
{/if}
