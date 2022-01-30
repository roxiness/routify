<script>
    import { Routify, Router } from '../../../lib/runtime/index.js'
    import routes from './.routify/routes.default.js'
    const instance = new Routify({ routes, debugger: false })
</script>

<Router {instance} />
