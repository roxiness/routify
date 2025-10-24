<script>
    import { pendingRoute } from '@roxi/routify'
</script>

{#if $pendingRoute}
    <div class="progress-bar" />
{/if}

<style>
    .progress-bar {
        position: fixed;
        inset: 0 0 calc(100% - 8px) 0;
        background: grey;
    }

    .progress-bar:after {
        content: '';
        display: block;
        background: #ff88ff;
        height: 100%;
        animation: progress 5s ease-out infinite;
    }

    @keyframes progress {
        from {
            width: 0%;
        }
        to {
            width: 100%;
        }
    }
</style>
