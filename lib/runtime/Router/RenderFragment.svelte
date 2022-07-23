<script>
    import Component from './Component.svelte'
    import { setContext } from 'svelte'
    import DecoRender from './DecoRender.svelte'
    /** @type {import('./types').RenderContext} */
    export let context
    export let props
    export let activeContext
    const { isActive, restFragments, single } = context // grab the stores
    let NodeComponent

    setContext('routify-fragment-context', context)
    $: shouldRender =
        $isActive ||
        (!$single &&
            !activeContext?.node.meta.multi?.exclude &&
            !context?.node.meta.multi?.exclude)

    $: if (!NodeComponent && shouldRender)
        context.node.getRawComponent().then(r => (NodeComponent = r))
</script>

{#if shouldRender && NodeComponent}
    <!-- DECORATOR COMPONENT
         we don't need to pass props as we provided them with "attachProps" in Component.svelte -->
    <svelte:component this={DecoRender} {context}>
        <!-- PAGE COMPONENT -->
        <svelte:component
            this={NodeComponent}
            {...context.fragment?.load?.props}
            {...props}
            {...context.fragment?.params}
            context={{
                ...context,
                load: context.fragment?.load,
                route: context.fragment?.route,
            }}
            let:props
            let:multi
            let:decorator
        >
            {#if $restFragments.length || (multi && !multi?.single)}
                <!-- CHILD PAGES -->
                <Component
                    options={{ multi, decorator, props }}
                    fragments={$restFragments}
                    {context}
                />
            {/if}
        </svelte:component>
    </svelte:component>
{/if}
