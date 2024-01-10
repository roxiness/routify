<script>
    import Navigation from './__components/Navigation.svelte'
    import { RouteOnScroll } from '@roxi/routify/helpers/RouteOnScroll'

    const routeOnScroll = new RouteOnScroll({
        scrollEvent: 'scroll', // or "scrollend"
        threshold: 100, // don't trigger until we're within 100px of the page
        direction: 'horizontal',
        strategy: 'withinThreshold',
    })
</script>

<div class="app">
    <main class="scroll-snap" data-routify-scroll-lock use:$routeOnScroll>
        <slot />
    </main>
    <Navigation />
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
</style>
