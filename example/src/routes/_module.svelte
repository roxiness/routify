<script>
    import FileTree from '../components/FileTree.svelte'
    import { SideNav } from 'polykit'
    export let context
</script>

<!-- <SideNav class="shadow bg-white">
    <aside slot="aside">
        <h1>Routify 3</h1>
        <FileTree node={context.node} />
    </aside>
    <main class="bg-gray-100  p-8">
        <slot />
    </main>
</SideNav> -->

<div class="app">
    <aside>
        <img src="/assets/routify3.svg" />
        <br />
        <br />
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
        max-width: 1280px;
        color: var(--indigo-300);
        margin-left: auto;
        margin-right: auto;
    }
    aside {
        width: var(--spacing-11);
        padding-top: var(--spacing-7);
        padding-left: var(--spacing-5);
    }
    main {
        background: #f4f7f9;
        border-radius: var(--spacing-5);
        margin: var(--spacing-5);
        padding: var(--spacing-6) var(--spacing-8);
        box-sizing: border-box;
    }
</style>
