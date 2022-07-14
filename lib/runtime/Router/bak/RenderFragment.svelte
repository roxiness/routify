<script>
    import Noop from '../decorators/Noop.svelte'
    import Component from './Component.svelte'
    import { setContext } from 'svelte'
    import DefaultDecorator from '../decorators/DefaultDecorator.svelte'
    /** @type {import('./types').RenderContext} */
    export let context
    export let single
    export let decorator
    export let props
    const { isActive, restFragments } = context
    let NodeComponent

    setContext('routify-fragment-context', context)
    $: shouldRender = $isActive || !single

    $: if (!NodeComponent && shouldRender)
        context.node.getRawComponent().then(r => (NodeComponent = r))
</script>

{#if shouldRender && NodeComponent}
    <!-- decorator component -->
    <svelte:component this={decorator?.component || DefaultDecorator} {context} {single}>
        <!-- the page component -->
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
            {#if $restFragments.length}
                <!-- child pages -->
                <Component
                    options={{ multi, decorator, props }}
                    fragments={$restFragments}
                />
            {/if}
        </svelte:component>
    </svelte:component>
{/if}
