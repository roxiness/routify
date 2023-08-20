<script context="module">
    import { setContext } from 'svelte'
    import api from './api.js'
</script>

<script>
    export let isRoot
    /** @type {RenderContext} */
    export let context

    setContext('weather-api', api[context.fragment.params.city])
</script>

<div>
    <slot />
</div>

<!-- routify:meta recursive=false -->
