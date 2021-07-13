<script>
    import FileTree from './__layout/FileTree.svelte'
    import TopNav from './__layout/TopNav.svelte'
    import { Sidenav, Backdrop, Sticky } from 'polykit'
    import Links from './__layout/Links.svelte'
    export let context
    let open
    let state
    let screenSize
</script>

<!-- routify:meta split|scoped -->

<div class="app {screenSize} {state}">
    <TopNav />
    <div class="container outer">
        <Sidenav
            bind:open
            bind:screenSize
            bind:state
            let:toggle
            asidePositioning="absolute">
            <aside slot="aside">
                <div class="sidenav-activator" on:click={toggle}>☰</div>
                <div class="container">
                    <div class="links">
                        <Links />
                        <hr />
                    </div>
                    <FileTree node={context.node} />
                </div>
            </aside>
            {#if ['mobile', 'tablet'].includes(screenSize)}
                <Backdrop bind:show={open} />
            {/if}

            <div class="container">
                <main>
                    <slot />
                </main>
            </div>
        </Sidenav>
    </div>
</div>

<style>
    /**
    * Global
    */
    .app {
        height: 100vh;
    }
    :global(.container) {
        max-width: 1240px;
        padding: 0 var(--spacing-4);
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
    aside {
        padding-top: 72px;
        position: fixed;
        width: inherit;
    }

    aside,
    .sidenav-activator {
        transition: all 0.4s;
    }

    .sidenav-activator {
        position: absolute;
        z-index: 1;
        padding: 4px 8px;
        right: 20px;
        top: 16px;
        font-weight: bolder;
        background: white;
        border-radius: 4px;
    }

    :global(.closed) .sidenav-activator {
        right: -48px;
    }

    /**
    * Mobile
    */
    .mobile main {
        padding: var(--spacing-6) var(--spacing-4);
    }
    :global(.mobile .container) {
        padding: 0;
    }

    .mobile aside,
    .tablet aside {
        top: 0;
        height: 100%;
        z-index: 1;
        background: white;
    }

    .mobile.open aside {
        box-shadow: 0 0 18px -3px rgba(0 0 0 / 0.4);
    }

    /**
    * Mobile
    */
    .tablet.open aside {
        /* box-shadow: 0 0 12px -12px rgba(0 0 0 / 0.4); */
    }

    /**
    * Desktop
    */

    .desktop .sidenav-activator {
        display: none;
    }
</style>
