<script context="module">
    import { Router as RouterJs } from '@roxi/routify/lib/runtime/Router/Router.js'
    import { instance, Router } from '../../.routify/instance.default.js'

    const router = new RouterJs(instance, {})

    export const load = PageParams => router.url.replace(PageParams.page.path)
</script>

<Router {router} />
