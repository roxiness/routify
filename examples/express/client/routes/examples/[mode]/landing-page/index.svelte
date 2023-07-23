<script>
    import Cat from './__components/cat.svelte'
</script>

<!-- routify:meta inline -->
<!-- routify:meta order=0 -->

<section class="hero">
    <div class="hero-content">
        <Cat />
        <h1 class="hero-title">Inline vs Standalone</h1>
        <p class="hero-description">An example combining inline and standalone pages</p>
    </div>
</section>

<style>
    .hero {
        display: grid;
        align-items: end;
        min-height: calc(var(--frame-inner-height) - var(--nav-height) - 3vw - 3vw);
    }
</style>
