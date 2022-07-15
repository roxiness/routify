<script context="module">
    import { Router, router } from '../.routify/instance.default.js'
    export const load = url => router.url.replace(url)
</script>

<Router {router} />
