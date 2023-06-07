<script>
    import Nav from '@/components/Nav.svelte'
    import ThemePicker from '@/components/ThemePicker.svelte'
</script>

<header>
    <nav>
        <a href="/" class="brand">
            <h4>Routify 3 App</h4>
        </a>
        <div class="spacer" />
        <Nav />
    </nav>
</header>
<main>
    <slot />
</main>

<ThemePicker />

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
    }
</style>
