<script context="module">
    import { Router, createRouter } from '@roxi/routify'
    import routes from '../../.routify/routes.default.js'

    const router = createRouter({ routes })

    // for SSR we need to tell Sveltekit to wait for Routify to finish loading its components
    export const load = payload => router.url.replace(payload.page.path)
</script>

<Router {router} />
