<script>
    import { setContext } from 'svelte'
    import Noop from '../decorators/Noop.svelte'

    /** @type {RouteFragment[]}*/
    export let fragments

    export let decorator = null

    export let props = {}

    const context = {}
    setContext('routify-fragment-context', context)

    $: [fragment, ...restFragments] = [...fragments]
    $: ({ node, load, route, params } = fragment)
    $: Object.assign(context, { route, node, load, localParams: params })
</script>

<svelte:component this={decorator || Noop} {context}>
    <svelte:component
        this={fragment.node.module().default}
        {context}
        {...props}
        let:props
        let:decorator>
        {#if restFragments.length}
            <svelte:self fragments={restFragments} {...load} {props} {decorator} />
        {/if}
    </svelte:component>
</svelte:component>
