<script context="module">
    import { Router, createRouter } from '@roxi/routify'
    import routes from '../../.routify/routes.default.js'

    const router = createRouter({ routes })

    /* for SSR we need to tell Sveltekit to wait for
       Routify to finish loading its components */
    export const load = async ({ url }) => {
        await router.url.replace(url.pathname + url.search)
        return {}
    }
</script>

<Router {router} />
