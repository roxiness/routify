<script>
    import TopNav from './__layout/TopNav.svelte'
    import { Window } from 'polykit'
</script>

<!-- routify:meta split|scoped -->

<Window let:size>
    <div class="app {size}">
        <TopNav />
        <slot />
    </div>
</Window>
