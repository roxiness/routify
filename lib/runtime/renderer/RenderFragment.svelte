<script>
    import Compose from './ComposeFragments.svelte'
    import { setContext } from 'svelte'
    import DecoratorWrapper from './DecoratorWrapper.svelte'
    import Noop from '../decorators/Noop.svelte'
    import AnchorDecorator from '../decorators/AnchorDecorator.svelte'
    import { isAnonFn } from '../utils'
    /** @type {RenderContext} */
    export let context
    export let props
    const { isVisible, childFragments } = context // grab the stores
    let NodeComponent = context.node.module?.default || context.node.asyncModule || Noop
    setContext('routify-fragment-context', context)
    /** @param {HTMLElement} elem */
    const updateRenderContext = (elem, newMeta) => {
        elem['__routify_meta'] = {
            ...elem['__routify_meta'],
            renderContext: { ...elem['__routify_meta']?.renderContext, ...newMeta },
        }
        return elem
    }

    /**
     * @param {HTMLElement} parent
     * @param {HTMLElement} anchor
     */
    const initialize = (parent, anchor) => {
        context.elem.set({ anchor, parent })
        parent = updateRenderContext(parent, { parent: context })
        if (anchor) anchor = updateRenderContext(anchor, { anchor: context })
    }

    $: if (isAnonFn(NodeComponent) && $isVisible)
        context.node.loadModule().then(r => (NodeComponent = r.default))

    $: ({ params, load, route } = context.fragment)

    $: compProps = { ...params, ...load?.props, ...props }
    /** @type {RoutifyContext}*/
    $: routifyContext = { ...context, load, route }
</script>

{#if $isVisible && !isAnonFn(NodeComponent)}
    <!-- todo IMPORTANT display: contents in style will set bouningClient().top to 0 for all elements -->
    <AnchorDecorator location={context.anchorLocation} onMount={initialize} {context}>
        <!-- DECORATOR COMPONENT
        we don't need to pass props as we provided them with "attachProps" in Component.svelte -->
        <DecoratorWrapper {context}>
            <!-- PAGE COMPONENT -->
            <svelte:component
                this={NodeComponent}
                {...compProps}
                context={routifyContext}
                let:props
                let:multi
                let:decorator
                let:anchor
                let:options
                let:scrollBoundary
                >{#if $childFragments.length || (multi && !multi?.single)}
                    <!-- CHILD PAGES -->
                    <Compose
                        options={{
                            multi,
                            decorator,
                            props,
                            options,
                            scrollBoundary,
                            anchor: anchor || context.anchorLocation,
                        }}
                        {context} />
                {/if}</svelte:component>
        </DecoratorWrapper>
    </AnchorDecorator>
{/if}
