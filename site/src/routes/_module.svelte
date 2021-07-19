<script>
    import TopNav from './__layout/TopNav.svelte'
    import { Window } from 'polykit'
</script>

<!-- routify:meta split|scoped -->

<Window let:screenSize>
    <div class="app {screenSize}">
        <TopNav />
        <slot />
    </div>
</Window>
