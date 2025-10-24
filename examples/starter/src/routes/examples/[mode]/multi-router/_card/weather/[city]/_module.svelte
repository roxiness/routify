<script>
    import { url, isActiveFragment } from '@roxi/routify'
    import api from '../api'
    import { setContext } from 'svelte'
    export let context, city

    setContext('weather-api', api[context.fragment.params.city])
</script>

<div class="entry" class:active={$isActiveFragment('.', { city })}>
    <a class="city-name" href={$url('$leaf', { city })}>
        <h3>{city}</h3>
    </a>

    <div class="links">
        <a
            href={$url('./index', { city })}
            class:active={$isActiveFragment('./index', { city })}>Overview</a>
        <a
            href={$url('./forecast', { city })}
            class:active={$isActiveFragment('./forecast', { city })}>Forecast</a>
        <a
            href={$url('./alerts', { city })}
            class:active={$isActiveFragment('./alerts', { city })}>Alerts</a>
    </div>

    <slot />
</div>

<style>
    .entry {
        height: 100%;
    }
    .city-name {
        position: absolute;
        inset: 16px auto auto 32px;
        font-weight: bolder;
        text-decoration: none;
        color: var(--text-1);
        /* uppercase */
        text-transform: uppercase;
    }
    .city-name h3 {
        font-size: var(--font-size-6);
    }
    .links {
        position: absolute;
        inset: auto 32px 16px auto;
        font-size: x-large;
        font-weight: bolder;
    }
    .links a {
        padding: 5px 10px;
        color: rgba(var(--surface-shadow-light), 0.1);
        color: var(--text-1);
        opacity: 0.5;
        text-decoration: none;
    }
    .links a:hover {
        opacity: 0.8;
    }
    .links a.active {
        opacity: 1;
    }
</style>
