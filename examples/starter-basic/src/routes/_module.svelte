<script>
    import Loader from '@/components/Loader.svelte'
    import Nav from '@/components/Nav.svelte'
    import ThemePicker from '@/components/ThemePicker.svelte'
    export let context
    const { node } = context
</script>

<header>
    <nav>
        <a href="/" class="brand">
            <h4>Routify 3 App</h4>
        </a>
        <div class="spacer" />
        <Nav {node} />
    </nav>
</header>
<main>
    <slot />
</main>

<ThemePicker />
<Loader />
