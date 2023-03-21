<script context="module">
    import { Router, createRouter } from '@roxi/routify'
    import routes from '../.routify/routes.default.js'
    import ProgressBar from './components/ProgressBar.svelte'

    export const router = createRouter({ routes })
</script>

<Router {router} />
<ProgressBar {router} />
