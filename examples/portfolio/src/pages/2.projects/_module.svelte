<script>
    import { meta, url, activeRoute } from '@roxi/routify'
</script>

<div class="page">
    <h1>projects</h1>
    <div class="projects">
        {#each $meta.repos as repo}
            <article>
                <h3>
                    <a href={$url('./[project]', { project: repo.data.name })}>
                        {repo.data.name}
                    </a>
                </h3>
                <p>
                    {repo.data.description}
                </p>
            </article>
        {/each}
    </div>
    <slot />
</div>

<style>
    .page {
        position: relative;
    }
    .projects {
        height: 400px;
        overflow-y: auto;
    }
</style>
