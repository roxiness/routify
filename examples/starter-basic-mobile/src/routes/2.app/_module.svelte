<script>
    import Carousel from '@roxi/routify/Carousel'
    import Navigation from './__components/Navigation.svelte'
</script>

<div class="app">
    <Carousel>
        <slot />
    </Carousel>
    <Navigation />
</div>

<style>
    .app {
        display: grid;
        grid-template-rows: 1fr auto;
        height: 100vh;
    }
</style>
