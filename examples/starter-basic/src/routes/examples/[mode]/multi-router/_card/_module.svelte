<script>
    import { isActive } from '@roxi/routify'
</script>

<div class="card">
    <slot />
    <!-- we don't want to show the home button on the overview page -->
    {#if !$isActive('../index', {}, { recursive: false })}
        <div class="close">
            <a href="/">
                <svg
                    class="close-button"
                    viewBox="0 0 122.88 113.97"
                    width="26"
                    height="26"
                    ><path
                        d="M18.69,73.37,59.18,32.86c2.14-2.14,2.41-2.23,4.63,0l40.38,40.51V114h-30V86.55a3.38,3.38,0,0,0-3.37-3.37H52.08a3.38,3.38,0,0,0-3.37,3.37V114h-30V73.37ZM60.17.88,0,57.38l14.84,7.79,42.5-42.86c3.64-3.66,3.68-3.74,7.29-.16l43.41,43,14.84-7.79L62.62.79c-1.08-1-1.24-1.13-2.45.09Z" /></svg>
            </a>
        </div>
    {/if}
</div>

<style>
    .card {
        position: relative;
        padding: 10px;
        height: 260px;
        border: 1px solid transparent;

        background: var(--surface-2);
        box-shadow: var(--shadow-2);
        border-radius: var(--radius-3);
    }
    .close {
        position: absolute;
        bottom: 20px;
        left: 16px;
    }
    a {
        display: block;
    }
    .close-button {
        cursor: pointer;
        transition: transform 0.3s;
        fill: var(--surface-4);
        stroke: var(--surface-1);
    }
    .close-button:hover {
        transform: scale(1.1);
    }
</style>
