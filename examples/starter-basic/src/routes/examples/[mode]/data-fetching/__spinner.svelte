<script>
    import { pendingRoute } from '@roxi/routify'
    import Spinner from '../__components/Spinner.svelte'
</script>

{#if $pendingRoute}
    <div class="spinner-wrapper">
        <div class="spinner-overlay" />
        <Spinner />
    </div>
{/if}

<style>
    .spinner-wrapper {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
    }
    .spinner-wrapper > :global(svg) {
        position: relative;
        width: 15vw;
    }
    .spinner-overlay {
        position: absolute;
        inset: 0;
        background: var(--surface-1);
        opacity: 0.7;
        pointer-events: none;
    }
</style>
