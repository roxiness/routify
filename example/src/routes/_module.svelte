<script>
    import FileTree from '#cmp/FileTree.svelte'
    import TopNav from '#cmp/TopNav.svelte'
    import SideNav from '#cmp/Sidenav/Sidenav.svelte'
    import Backdrop from '#cmp/Sidenav/Backdrop.svelte'
    export let context
    let open
</script>

<!-- routify:meta split|scoped -->

<div class="app">
    <TopNav />
    <div class="container">
        <SideNav desktop="shrink" mobile="" bind:open>
            <aside slot="aside">
                <br />
                <br />
                <FileTree node={context.node} />
            </aside>
            <Backdrop bind:show={open} />
            <main>
                <slot />
            </main>
        </SideNav>
    </div>
</div>

<style>
    :global(.container) {
        max-width: 1240px;
        padding: 0;
    }
    .app {
        height: 100vh;
    }
    main {
        display: inline-block; /* prevent collapsing margins */
        width: 100%;
        min-height: 400px;
        background: #f4f7f9;
        margin: var(--spacing-5) var(--spacing-4);
        border-radius: var(--spacing-5);
        padding: var(--spacing-6) var(--spacing-8);
    }
</style>
