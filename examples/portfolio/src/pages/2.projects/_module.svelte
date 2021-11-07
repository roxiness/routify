<script>
    import { meta, url, activeRoute } from '@roxi/routify'
</script>

<div class="page">
    <h1>projects</h1>
    <ul class="projects">
        {#each $meta.repos as repo}
            <div>
                <h3>
                    <a href={$url('./[project]', { project: repo.data.name })}>
                        {repo.data.name}
                    </a>
                    <p>
                        {repo.data.description || ''}
                    </p>
                </h3>
            </div>
        {/each}
    </ul>
    <slot />
</div>

<style>
    .page {
        position: relative;
    }
    .projects {
        /* overflow-y: auto; */
        /* display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly; */
    }
    article {
        /* margin: 10; */
        flex: 0 0 30%;
    }
</style>
