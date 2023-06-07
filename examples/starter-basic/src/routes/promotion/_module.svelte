<!-- routify:meta reset -->
<script>
    import Nav from '@/components/Nav.svelte'
    import LandingPageSection from './__components/LandingPageSection.svelte'
</script>

<header>
    <nav>
        <a href="/promotion" class="brand">
            <h4>Promotion</h4>
        </a>
        <div class="spacer" />
        <Nav />
    </nav>
</header>
<main>
    <!-- anchor options: 'wrapper' | 'header' | 'parent' | 'firstChild' -->
    <!-- TODO firstChild does not work for the showcases module -->
    <slot
        anchor="firstChild"
        decorator={{ component: LandingPageSection, recursive: false }} />
</main>

<style>
    /* make header float */
    header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
    /* offset content */
    main {
        margin-top: 128px;
        border: 96px solid green;
    }
</style>
