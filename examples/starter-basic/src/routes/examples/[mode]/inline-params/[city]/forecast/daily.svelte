<script>
    import { getContext } from 'svelte'
    import { conditionsMap } from '../../app'

    const api = getContext('weather-api')
</script>

<div class="forecast-items">
    {#each api.forecast.daily.slice(0, 4) as { day, high, low, conditions }}
        <div class="item">
            <div class="day">{day}</div>
            <div class="icon">
                {conditionsMap[conditions] || conditions}
                <div class="icon-text">{conditions}</div>
            </div>
            <div class="temp">{high}/{low} f</div>
        </div>
    {/each}
</div>

<!-- routify:meta name="hourly" -->
<style>
    .item div {
        text-align: center;
    }
    .day {
        font-size: var(--font-size-3);
    }
    .temp {
        font-size: var(--font-size-2);
    }
    .icon {
        font-size: var(--font-size-7);
        margin-block: -0.7rem -0.7rem;
        position: relative;
        cursor: default;
    }
    .icon-text {
        position: absolute;
        inset: 0 0 0 0;
        background: var(--surface-1);
        font-size: var(--font-size-2);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10%;
        opacity: 0;
    }
    .icon:hover .icon-text {
        opacity: 1;
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
