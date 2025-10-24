<script>
    import { getContext } from 'svelte'
    import { conditionsMap } from '../../app'

    const api = getContext('weather-api')
</script>

<div class="forecast-items">
    {#each api.forecast.hourly as { hour, temperature, conditions }}
        <div class="item">
            <div class="time">{hour}</div>
            <div class="icon">{conditionsMap[conditions]}</div>
            <div class="temp">{temperature} f</div>
        </div>
    {/each}
</div>

<!-- routify:meta isDefault -->

<!-- routify:meta name="hourly" -->
<style>
    .item div {
        text-align: center;
    }

    .temp {
        font-size: var(--font-size-2);
    }
    .time {
        font-size: var(--font-size-3);
    }

    .forecast-items {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 1rem;
        margin-inline: 1rem;
        height: 100%;
        align-items: center;
        justify-items: center;
    }

    div {
        font-size: var(--font-size-4);
    }
</style>
