<script>
    import Compose from './ComposeFragments.svelte'
    import DecoratorWrapper from './DecoratorWrapper.svelte'
    import Noop from '../decorators/Noop.svelte'
    import AnchorDecorator from '../decorators/AnchorDecorator.svelte'
    import { isAnonFn, setRoutifyFragmentContext, waitFor } from '../utils/index.js'
    /** @type {RenderContext} */
    export let context
    const { isVisible, childFragments } = context // grab the stores
    let NodeComponent = context.node.module?.default || context.node.asyncModule || Noop
    setRoutifyFragmentContext(context)
    /** @param {HTMLElement} elem */
    const updateRenderContext = (elem, newMeta) => {
        if (elem)
            elem['__routify_meta'] = {
                ...(elem && elem['__routify_meta']),
                renderContext: { ...elem['__routify_meta']?.renderContext, ...newMeta },
            }
        return elem
    }

    /**
     * @param {HTMLElement} parent
     * @param {HTMLElement} anchor
     */
    const initialize = async (parent, anchor) => {
        // wait for parent to be ready, otherwise context.elm won't be set in the correct order
        context.parentContext && (await waitFor(context.parentContext.elem, Boolean))
        context.elem.set({ anchor, parent })
        // TODO parent context should be parent context, not context. But we also need a parent of context if we're using a wrapper.
        parent = updateRenderContext(parent, { parent: context })
        if (anchor) anchor = updateRenderContext(anchor, { anchor: context })
    }

    const childMounted = () => {
        context.mounted.resolve(context)
    }

    $: hasInlineChildren = context.node.children.some(child => child.meta.inline)

    $: if (isAnonFn(NodeComponent) && $isVisible)
        context.node.loadModule().then(r => (NodeComponent = r.default))

    $: ({ params, load } = context.fragment)

    $: compProps = { ...params, ...load?.props, ...context.props }
</script>

{#if $isVisible && !isAnonFn(NodeComponent)}
    <!-- todo IMPORTANT display: contents in style will set boundingClient().top to 0 for all elements -->
    <!-- DECORATOR COMPONENT
        we don't need to pass props as we provided them with "attachProps" in Component.svelte -->
    <DecoratorWrapper {context}>
        <AnchorDecorator location={context.anchorLocation} onMount={initialize} {context}>
            <!-- PAGE COMPONENT -->
            <svelte:component
                this={NodeComponent}
                {...compProps}
                {...context.props}
                {context}
                let:props
                let:inline
                let:multi
                let:decorator
                let:anchor
                let:options
                let:scrollBoundary
                >{#if $childFragments.length || ((hasInlineChildren || inline || multi) && !(inline || multi)?.single)}
                    <!-- CHILD PAGES -->
                    <Compose
                        options={{
                            inline: inline || multi,
                            decorator,
                            props,
                            options,
                            scrollBoundary,
                            anchor: anchor || context.anchorLocation,
                        }}
                        {context} />
                {/if}</svelte:component>
            <div use:childMounted />
        </AnchorDecorator>
    </DecoratorWrapper>
{/if}

<!-- TODO if decorator is inside anchor, scrollIntoView doesn't work -->
<!-- TODO if anchor is inside decorator, scrollToTop doesn't work -->
<!-- TODO this is a matter of parent anchor vs firstChildAnchor. firstChild wants a nested decoratorWrapper to latch onto. `parent` wants a parentDecorator. -->
