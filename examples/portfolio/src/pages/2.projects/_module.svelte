<script>
    import { meta, url } from '@roxi/routify'
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
</style>
