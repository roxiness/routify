<script>
    import { InlineNav } from '@roxi/routify/lib/components/index'
</script>

<h1>Portfolio</h1>
<a href="/home">home</a>
<a href="/about-me">about me</a>
<a href="/projects">projects</a>

<InlineNav let:pages let:index>
    <div class="container" style="--page-index: {index}">
        {#each pages as { Page }}
            <article class="page">
                <Page />
            </article>
        {/each}
    </div>
</InlineNav>

<style>
    :global(html),
    :global(body) {
        overflow: hidden;
    }
    .container {
        transition: transform 0.3s;
        transform: translateX(calc(-100% * var(--page-index)));
        display: flex;
        padding: 0 80px;
    }
    article {
        flex: 0 0 100%;
        margin-right: 160px;
    }
</style>
