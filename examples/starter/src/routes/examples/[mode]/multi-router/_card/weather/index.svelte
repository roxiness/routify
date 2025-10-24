<script>
    import { url } from '@roxi/routify'
    const cities = ['new-york', 'london', 'tokyo', 'sydney']
</script>

<div>
    <h1>Pick a city</h1>
    <br />
    <div>
        {#each cities as city}
            <a class="button" href={$url('../[city]', { city })}>{city}</a>
        {/each}
    </div>
</div>
