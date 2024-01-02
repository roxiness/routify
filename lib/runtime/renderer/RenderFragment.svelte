<script>
    import Compose from './ComposeFragments.svelte'
    import DecoratorWrapper from './DecoratorWrapper.svelte'
    import AnchorDecorator from '../decorators/AnchorDecorator.svelte'
    import { setRoutifyFragmentContext, waitFor } from '../utils/index.js'
    import Noop from '../decorators/Noop.svelte'
    /** @type {RenderContext} */
    export let context

    let isMounted = false
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

    const childMounted = _elem => {
        isMounted = true
        context.mounted.resolve(context)
        context.router.log.verbose('render', context.node.path, context) // ROUTIFY-DEV-ONLY
    }

    $: ({ childFragments, fragment } = context) // grab the stores

    $: hasInlineChildren = context.node.navigableChildren.some(child => child.meta.inline)

    $: compProps = { ...fragment.params, ...fragment.load?.props, ...context.props }
</script>

<!-- todo IMPORTANT display: contents in style will set boundingClient().top to 0 for all elements -->
<!-- DECORATOR COMPONENT
        we don't need to pass props as we provided them with "attachProps" in Component.svelte -->
<svelte:component this={context.decorators.length ? DecoratorWrapper : Noop} {context}>
    {#await context.node.loadModule() then}
        <AnchorDecorator {context} onMount={initialize}>
            <!-- PAGE COMPONENT -->
            <svelte:component
                this={context.node.module.default}
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
            {#if !isMounted}
                <div use:childMounted />
            {/if}
        </AnchorDecorator>
    {/await}
</svelte:component>

<!-- TODO if decorator is inside anchor, scrollIntoView doesn't work -->
<!-- TODO if anchor is inside decorator, scrollToTop doesn't work -->
<!-- TODO this is a matter of parent anchor vs firstChildAnchor. firstChild wants a nested decoratorWrapper to latch onto. `parent` wants a parentDecorator. -->
