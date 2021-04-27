<script>
    import FileTree from '../components/FileTree.svelte'
    export let payload
</script>

<div class="app">
    <aside>
        <h1>Routify 3</h1>
        <FileTree node={payload.node} />
    </aside>
    <main>
        <slot />
    </main>
</div>

<style>
    .app {
        display: grid;
        grid-template-columns: 200px auto;
        height: 100vh;
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
