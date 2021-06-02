<script>
    import { Routify, Router } from '@roxi/routify'
    import { routes } from '../.routify/routes.default.js'
    const instance = new Routify({ routes, debugger: false })
</script>

<Router {routes} />
