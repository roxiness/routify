<script>
    import { Router } from '@roxi/routify'
    import routes from '../.routify/routes.default.js'

    /** @type {UrlRewrite}*/
    const urlRewrite = {
        toExternal: url => '/subpath' + url,
        toInternal: url => url.replace(/^\/subpath/, ''),
    }
</script>

<Router {routes} {urlRewrite} />
