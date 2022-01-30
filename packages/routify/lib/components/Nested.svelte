<script>
    import Component from '../runtime/Router/Component.svelte'
    import { context } from '@roxi/routify'
    export let fragments
    fragments = fragments || $context.route.fragments.slice(1)
</script>

<Component {fragments} />
