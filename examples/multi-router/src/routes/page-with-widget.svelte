<script>
    import { Router } from '@roxi/routify'
    import WidgetRoutes from '../../.routify/routes.widget.js'
</script>

<Router name="nested1" routes={WidgetRoutes} />
<Router name="nested2" routes={WidgetRoutes} />
