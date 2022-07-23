<script>
    import Component from './ComposeFragments.svelte'
    import { setContext } from 'svelte'
    import DecoratorWrapper from './DecoratorWrapper.svelte'
    /** @type {import('./types').RenderContext} */
    export let context, props, activeContext
    const { isActive, childFragments, single } = context // grab the stores
    let NodeComponent

    setContext('routify-fragment-context', context)

    const notExcludedCtx = context => !context?.node.meta.multi?.exclude
    const isPartOfPage = () => !$single && [context, activeContext].every(notExcludedCtx)
    $: isVisible = $isActive || isPartOfPage()

    $: if (!NodeComponent && isVisible)
        context.node.getRawComponent().then(r => (NodeComponent = r))
</script>

{#if isVisible && NodeComponent}
    <!-- DECORATOR COMPONENT
         we don't need to pass props as we provided them with "attachProps" in Component.svelte -->
    <svelte:component this={DecoratorWrapper} {context}>
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
            let:decorator>
            {#if $childFragments.length || (multi && !multi?.single)}
                <!-- CHILD PAGES -->
                <Component options={{ multi, decorator, props }} {context} />
            {/if}
        </svelte:component>
    </svelte:component>
{/if}
