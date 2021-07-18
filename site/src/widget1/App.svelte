<script>
    import { Router, instance } from '../../.routify/instance.widget1.js'
    instance.options.debugger = true
    instance.options.activeUrl = 'internal'
</script>

<div class="main">
    <Router {instance} />
</div>
