<script>
    import { transition } from '@roxi/routify/decorators'
    import ProgressBar from '@/components/ProgressBar.svelte'
    import ThemePicker from '@/components/ThemePicker.svelte'

    const decorator = transition({ axis: 'y' })
</script>

<ProgressBar />
<ThemePicker />
<div class="app-container">
    <slot {decorator} />
</div>

<!-- routify:meta bundle -->
<style>
    .app-container {
        overflow: hidden;
        display: grid;
    }
</style>
