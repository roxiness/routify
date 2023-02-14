<script>
    import { isActive, node, activeRoute, context } from '@roxi/routify'
    import FrontpageBlock from './__decorators/FrontpageBlock.svelte'

    /** @type {Decorator} */
    const decorator = {
        component: FrontpageBlock,
        recursive: false,
    }
</script>

<!-- routify:meta reset=true -->
<header class="fixed grey3">
    <nav>
        <h5>
            <a href="/">Kitchensink</a>
        </h5>
        <div class="max" />
        <a
            class="button  {$activeRoute.url === $node.path ? 'border' : 'transparent'}"
            href={$node.path}>{$node.name}</a>

        {#each $node.pages as childNode}
            <a
                class="button  {$isActive(childNode.path) ? 'border' : 'transparent'}"
                href={childNode.path}>{childNode.meta.title || childNode.name}</a>
        {/each}
    </nav>
</header>
<div class="responsive">
    <slot anchor="firstChild" multi scrollBoundary={null} {decorator} />
</div>

<style>
    :global(*) {
        scroll-behavior: smooth;
    }
</style>
