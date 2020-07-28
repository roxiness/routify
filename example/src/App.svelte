<script>
  import { setContext } from 'svelte'
  import { Router, basepath } from '@roxi/routify'
  import { routes } from '../.routify/routes'
  import { writable } from 'svelte/store'
  import ServiceWorker from './ServiceWorker.svelte'

  const params = new URLSearchParams(location.search)
  const bp = params.get('basepath')
  if (bp) $basepath = bp    
</script>

<Router {routes} />
<ServiceWorker />
