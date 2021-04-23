<script>
    import { Routify, Router } from '../../runtime/index.js'
    import { routes } from '../.routify/routes.default.js'
    const instance = new Routify({ routes, debugger: false })
</script>

<Router {instance} />
