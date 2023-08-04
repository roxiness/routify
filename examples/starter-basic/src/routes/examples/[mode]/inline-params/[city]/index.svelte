<script>
    import { getContext } from 'svelte'
    import { conditionsMap } from '../app'

    const { weatherOverview } = getContext('weather-api')
</script>

<div class="weather-info">
    <div class="item">
        <div class="status">
            {weatherOverview.conditions}
        </div>
        <div class="icon">{conditionsMap[weatherOverview.conditions]}</div>
    </div>
    <div class="item">
        <div class="status">{weatherOverview.humidity} %</div>
        <div class="icon">💧</div>
    </div>
    <div class="item">
        <div class="status">{weatherOverview.temperature} f</div>
        <div class="icon">☀️</div>
    </div>
    <div class="item">
        <div class="status">{weatherOverview.windSpeed} m/s</div>
        <div class="icon">💨</div>
    </div>
</div>

<style>
    .item div {
        text-align: center;
        /* font-size: var(--font-size-8); */
    }
    .weather-info {
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
