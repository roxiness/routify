<script>
    import Component from './ComposeFragments.svelte'
    import { setContext } from 'svelte'
    import DecoratorWrapper from './DecoratorWrapper.svelte'
    import Noop from '../decorators/Noop.svelte'
    /** @type {import('./types').RenderContext} */
    export let context, props, activeContext
    const { isActive, childFragments, single } = context // grab the stores
    let NodeComponent =
        context.node.module?.default || (!context.node.asyncModule && Noop)
    let elem
    const setElem = _elem => (elem = _elem)
    setContext('routify-fragment-context', context)

    $: if (elem) {
        const _elem = elem
        context.fragment.setElem(_elem)
        _elem['__routify_meta'] = _elem['__routify_meta'] || {}
        _elem['__routify_meta'].renderContext = context
    }

    const notExcludedCtx = context => !context?.node.meta.multi?.exclude
    const isPartOfPage = () => !$single && [context, activeContext].every(notExcludedCtx)
    $: isVisible = $isActive || isPartOfPage()

    $: if (!NodeComponent && isVisible)
        context.node.getRawComponent().then(r => (NodeComponent = r))

    $: ({ params, load, route } = context.fragment)

    $: compProps = { ...params, ...load?.props, ...props }
    $: userContext = { ...context, load, route }
</script>

<!-- todo create anchor wrapper -->
{#if isVisible && NodeComponent}
    <!-- todo IMPORTANT display: contents in style will set bouningClient().top to 0 for all elements -->
    <div use:setElem id={context.node.name}>
        <!-- DECORATOR COMPONENT
        we don't need to pass props as we provided them with "attachProps" in Component.svelte -->
        <DecoratorWrapper {context} root={true}>
            <!-- PAGE COMPONENT -->
            <svelte:component
                this={NodeComponent}
                {...compProps}
                context={userContext}
                let:props
                let:multi
                let:decorator
                let:options>
                {#if $childFragments.length || (multi && !multi?.single)}
                    <!-- CHILD PAGES -->
                    <Component options={{ multi, decorator, props, options }} {context} />
                {/if}
            </svelte:component>
        </DecoratorWrapper>
    </div>
{/if}
