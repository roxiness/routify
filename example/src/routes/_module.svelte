<script>
    import FileTree from '../components/FileTree.svelte'
    export let context
</script>

<div class="app">
    <aside>
        <h1>Routify 3</h1>
        <FileTree node={context.node} />
    </aside>
    <main>
        <slot />
    </main>
</div>

<!-- routify:meta split|scoped -->
<style>
    h1 {
        white-space: nowrap;
    }
    .app {
        display: grid;
        grid-template-columns: min-content auto;
        height: 100vh;
    }
    aside {
        padding-top: 32px;
        padding-left: 32px;
    }
    main {
        background: #f4f7f9;
        border-radius: 32px;
        margin: 32px;
        padding: 40px 32px;
        min-height: calc(100%-32px);
        box-sizing: border-box;
    }
</style>
