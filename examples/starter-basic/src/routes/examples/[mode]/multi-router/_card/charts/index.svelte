<script>
    import { url } from '@roxi/routify'
    const charts = ['daily', 'weekly', 'monthly']
</script>

<div>
    <h1>Pick a chart</h1>
    <br />
    <div>
        {#each charts as chart}
            <a class="button" href={$url('../' + chart)}>{chart}</a>
        {/each}
    </div>
</div>
