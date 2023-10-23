<script>
    import { url } from '@roxi/routify'
    const images = []
</script>

<div>
    <h1>Pick an image</h1>
    <br />
    <div>
        {#each images as image}
            <a class="button" href={$url('../[image]', { image })}>{image}</a>
        {/each}
    </div>
</div>
