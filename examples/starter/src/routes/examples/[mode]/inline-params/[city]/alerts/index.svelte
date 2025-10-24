<script>
    import { getContext } from 'svelte'
    import { conditionsMap } from '../../app'

    const api = getContext('weather-api')
</script>

<div class="alerts">
    {#each api.alerts as alert}
        <div class="alert">
            <div class="type">
                {alert.type} ⚠️
            </div>
            <div class="time">{alert.time}</div>
            <div class="description">{alert.description}</div>
        </div>
    {/each}
</div>

<style>
    .alerts {
        display: grid;
        height: 100%;
        align-items: center;
        justify-items: center;
        font-size: var(--font-size-3);
    }
    .type {
        font-weight: bold;
    }
</style>
