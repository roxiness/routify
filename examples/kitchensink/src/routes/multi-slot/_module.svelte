<script>
    import { url } from '@roxi/routify'
    import FrontpageBlock from './__decorators/FrontpageBlock.svelte'
    /** @type {Decorator} */
    const decorator = {
        component: FrontpageBlock,
        recursive: false,
        // shouldRender: ({ context }) => context.node.hasComponent,
    }
</script>

<nav>
    <a href={$url('./')}>Home</a>
    <a href={$url('./hero')}>Hero</a>
    <a href={$url('./features')}>Features</a>
    <a href={$url('./examples')}>Examples</a>
</nav>

<div>
    <slot anchor="firstChild" multi scrollBoundary={null} {decorator} />
</div>

<!-- routify:meta reset=true -->
<style>
    nav {
        position: fixed;
        background: white;
        z-index: 1;
    }
    :global(*) {
        scroll-behavior: smooth;
    }
</style>
