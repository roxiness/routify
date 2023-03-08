<script>
    import { pendingRoute } from '@roxi/routify'
    let value = 0
    const runLoader = () => {
        value = 0
        const interval = setInterval(() => {
            const speed = 100 - value
            value = value + speed / 300
            if (value > 99.9) clearInterval(interval)
        }, 1000 / 60)
    }
    $: if ($pendingRoute) runLoader()
</script>

{#if $pendingRoute}
    <progress {value} max="100" />
{/if}
