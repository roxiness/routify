<script>
    import { url, context } from '@roxi/routify'
    import Nav from '@/components/Nav.svelte'
    import LandingPageSection from './__components/LandingPageSection.svelte'
</script>

<div class="app">
    <header>
        <nav>
            <a href={$url($context.node.path)} class="brand">
                <h4>Promotion</h4>
            </a>
            <div class="spacer" />
            <Nav />
        </nav>
    </header>
    <main>
        <!-- anchor options: 'wrapper' | 'header' | 'parent' | 'firstChild' -->
        <!-- TODO firstChild does not work for the showcases module -->
        <slot decorator={{ component: LandingPageSection, recursive: false }} />
    </main>
</div>

<!-- routify:meta resets -->

<!-- routify:meta description="A landing page showing inline pages." -->
<style>
    /* make header float */

    main {
        /* border: 96px solid green; */
    }
    :global(.example.node-promotion .frame) {
        scroll-behavior: smooth;
        /* border-radius: 120px; */
        /* background: hsl(var(--b1)); */
    }
</style>
