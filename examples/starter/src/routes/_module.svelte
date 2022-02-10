<header>
    <a href="/">home</a>
    <a href="/page">page</a>
</header>

<main>
    <slot />
</main>

<style>
    main {
        max-width: 860px;
        margin-left: auto;
        margin-right: auto;
    }
    header {
        position: fixed;
        background: white;
    }
</style>
