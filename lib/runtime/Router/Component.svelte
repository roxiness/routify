<script>
    import { setContext } from 'svelte'
    import Noop from '../decorators/Noop.svelte'
    import '#root/typedef.js'

    /** @type {RouteFragment[]}*/
    export let fragments

    export let decorator = null

    export let props = {}

    $: [fragment, ...restFragments] = [...fragments]
    $: ({ node, load, route, params } = fragment)
    $: context = { route, node, load, localParams: params }
    $: setContext('routify-fragment-context', context)
</script>

<svelte:component this={decorator || Noop} {context}>
    {#if restFragments.length}
        <svelte:component
            this={fragment.node.module().default}
            {context}
            {...props}
            let:props
            let:decorator>
            <svelte:self fragments={restFragments} {...load} {props} {decorator} />
        </svelte:component>
    {:else}
        <svelte:component
            this={fragment.node.module().default}
            {context}
            {...load}
            {...props} />
    {/if}
</svelte:component>
