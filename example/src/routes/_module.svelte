<script>
    import FileTree from '#cmp/FileTree.svelte'
    import TopNav from '#cmp/TopNav.svelte'
    import { SideNav } from 'polykit'
    export let context
</script>

<!-- routify:meta split|scoped -->

<div class="app">
    <TopNav />
    <div class="container main">
        <aside>
            <br />
            <br />
            <FileTree node={context.node} />
        </aside>
        <main>
            <slot />
        </main>
    </div>
</div>

<style>
    :global(.container) {
        max-width: 1240px;
    }
    .app {
        height: 100vh;
    }
    .main {
        display: grid;
        grid-template-columns: var(--left-nav) auto;
        color: var(--color-grey-700);
        margin-left: auto;
        margin-right: auto;
    }
    main {
        background: #f4f7f9;
        border-radius: var(--spacing-5);
        margin: var(--spacing-5) 0;
        padding: var(--spacing-6) var(--spacing-8);
        box-sizing: border-box;
    }
</style>
