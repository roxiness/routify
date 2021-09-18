<script>
    import Navbar from './_navbar.svelte'
    import { Sidenav, Backdrop, screenSize } from 'polykit'
    import Links from '../__layout/Links.svelte'
    export let context
    let open
    let state
    const rewrite = path => path.replace(/.*\/docs\/pages\/?/, '/docs/#')
</script>

<!-- routify:meta bundle -->

<div class="app {$screenSize} {state}">
    <div class="container outer">
        <Sidenav bind:open bind:state let:toggle asidePositioning="absolute">
            <aside slot="aside">
                <div class="sidenav-activator" on:click={toggle}>☰</div>
                <div class="container">
                    <div class="links">
                        <Links />
                        <hr />
                    </div>
                    <Navbar node={context.node.children.pages} {rewrite} />
                </div>
            </aside>
            {#if ['mobile', 'tablet'].includes($screenSize)}
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
        min-height: 400px;
        padding-top: 72px;
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
        cursor: pointer;
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
        padding-left: 24px;
        padding-right: 24px;
    }

    .mobile.open aside {
        box-shadow: 0 0 18px -3px rgba(0 0 0 / 0.4);
    }

    /**
    * Mobile
    */
    .mobile main {
        margin: 0;
        border-radius: 0;
    }

    /**
    * Desktop
    */

    .desktop .links,
    .desktop .sidenav-activator {
        display: none;
    }
</style>
