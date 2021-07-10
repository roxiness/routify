<script>
    import FileTree from '#cmp/FileTree.svelte'
    import TopNav from '#cmp/TopNav.svelte'
    import { Sidenav, Backdrop, Sticky } from 'polykit'
    export let context
    let open, screenSize
</script>

<!-- routify:meta split|scoped -->

<div class="app {screenSize}">
    <TopNav />
    <div class="container outer">
        <Sidenav desktop="shrink" mobile="" bind:open bind:screenSize>
            <aside slot="aside">
                <div class="container">
                    <br />
                    <Sticky
                        boundary={{ top: 160 }}
                        mode={open ? 'transform' : 'transform'}>
                        <FileTree node={context.node} />
                    </Sticky>
                </div>
            </aside>
            <!-- <Backdrop bind:show={open} --background="black" --opacity="0.1" /> -->
            <div class="container">
                <main>
                    <slot />
                </main>
            </div>
        </Sidenav>
    </div>
</div>

<style>
    :global(.container) {
        max-width: 1240px;
        padding: 0 var(--spacing-4);
    }
    .app {
        height: 100vh;
    }
    .container.outer {
        padding: 0;
    }
    main {
        display: inline-block; /* prevent collapsing margins */
        width: 100%;
        min-height: 400px;
        background: #f4f7f9;
        margin-top: var(--spacing-4);
        border-radius: var(--spacing-5);
        padding: var(--spacing-6) var(--spacing-8);
    }
</style>
