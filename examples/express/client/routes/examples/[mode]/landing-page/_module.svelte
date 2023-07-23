<script>
    import { url, context } from '@roxi/routify'
    import Nav from '@/components/Nav.svelte'
    import LandingPageSection from './__components/LandingPageSection.svelte'
</script>

<div class="app">
    <header>
        <nav>
            <a href={$url($context.node.path)} class="brand">
                <h4>Home</h4>
            </a>
            <div class="spacer" />
            <Nav />
        </nav>
    </header>
    <main>
        <!-- set recursive to false to make sure the decorator is only used on the child component and not its descendants -->
        <slot decorator={{ component: LandingPageSection, recursive: false }} />
    </main>
</div>

<!-- routify:meta _description="A landing page showing inline pages." -->
<style>
    :global(.example.node-landing-page .frame) {
        scroll-behavior: smooth;
    }
</style>
