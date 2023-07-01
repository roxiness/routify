<script>
    import { url, context } from '@roxi/routify'
    import Nav from '@/components/Nav.svelte'
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
        <slot />
    </main>
</div>

<!-- routify:meta description="Fetch data with the <code>load</code> hook before component render." -->