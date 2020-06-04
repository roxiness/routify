<script>
  import { setContext } from 'svelte'
  import { Router, basepath } from '@sveltech/routify'
  import { routes } from '@sveltech/routify/tmp/routes'
  import { writable } from 'svelte/store'
  import ServiceWorker from './ServiceWorker.svelte'

  const params = new URLSearchParams(location.search)
  const bp = params.get('basepath')
  if (bp) $basepath = bp    
</script>

<Router {routes} />
<ServiceWorker />
