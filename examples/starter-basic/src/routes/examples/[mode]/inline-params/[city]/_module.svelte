<script>
    import { url, isActiveFragment } from '@roxi/routify'
    export let city
</script>

<div class="entry card" class:active={$isActiveFragment('.', { city })}>
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
        position: relative;
        padding: 10px;
        height: 260px;
        border: 1px solid transparent;
    }
    .entry.active {
        border: 1px solid var(--text-1);
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

    .card {
        background: var(--surface-2);
        box-shadow: var(--shadow-2);
        border-radius: var(--radius-3);
    }
</style>
