<script>
    import { Routify, Router } from '../../../runtime/index.js'
    import { routes } from '../../.routify/routes.widget2.js'
    const instance = new Routify({
        routes,
        debugger: true,
        activeUrl: 'internal',
    })
</script>

<div class="main">
    <Router {instance} />
</div>
