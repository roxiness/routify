<script>
    import { url } from '@roxi/routify'
    import Nav from '@/components/Nav.svelte'
    export let context
</script>

<div class="app">
    <header>
        <nav>
            <a href={$url(context.node.path)} class="brand">
                <h4>Home</h4>
            </a>
            <div class="spacer" />
            <Nav />
        </nav>
    </header>
    <main>
        <!-- anchor options: 'wrapper' | 'header' | 'parent' | 'firstChild' -->
        <!-- TODO firstChild does not work for the showcases module -->
        <slot />
    </main>
</div>

<!-- routify:meta resets -->

<!-- routify:meta description="An admin page using guard hooks." -->
<style>
    main {
        padding-top: 3rem;
    }
</style>
