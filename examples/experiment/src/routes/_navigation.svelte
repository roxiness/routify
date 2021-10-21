<script>
    export let pages
</script>

<nav>
    {#each pages.children as page}
        <a href="/{page.name}">{page.name}</a>
    {/each}
</nav>

<style>
    nav {
        position: absolute;
        bottom: 0;
        /* background: white; */
    }
</style>
