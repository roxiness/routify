<script>
    import { url, isActiveFragment, params } from '@roxi/routify'
    /** @type {RenderContext}*/
    export let context
</script>

<div class="span">
    <a
        href={$url('./hourly', { city: $params.city })}
        class:active={$isActiveFragment('./hourly', { city: $params.city })}>Hourly</a>
    <a
        href={$url('./daily', { city: $params.city })}
        class:active={$isActiveFragment('./daily', { city: $params.city })}>Daily</a>
</div>

<slot />

<style>
    .span {
        position: absolute;
        inset: 0.5rem 1rem auto auto;
        display: flex;
        justify-content: space-around;
        gap: 0.5rem;
        align-items: center;
        margin: 1rem;
    }
    .span a {
        text-decoration: none;
        color: var(--text-1);
        font-size: var(--font-size-4);
        opacity: 0.3;
    }
    .span a:hover {
        opacity: 0.8;
    }
    .span a.active {
        opacity: 1;
    }
</style>
