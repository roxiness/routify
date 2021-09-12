<script>
    import { url } from '@roxi/routify'
    const urls = [
        $url('.'),
        $url('../about'),
        $url('../[slug]', { slug: 'hello' }),
        $url('../[slug]', { slug: 'hello', sort: 'desc', theme: 'default' }),
    ]
</script>

{#each urls as path}
    <div>
        <a href={path}>{path}</a>
    </div>
{/each}
