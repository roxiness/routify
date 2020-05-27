<script context="module">
  import { writable, derived } from 'svelte/store'
  const iframeNum = 2
  let queue = writable([])
  let actives = derived(queue, q => q.filter(q => q.isActive))
  let queued = derived(queue, q => q.filter(q => q.isQueued))

  const defaults = {
    prefetchValidFor: 60,
    prefetch: true,
    timeout: 10,
  }

  export function prefetch(path, options = {}) {
    options = { ...defaults, ...options, path }
    if (window.routify.prefetched || navigator.userAgent.match('jsdom'))
      return false

    queue.update(q => {
      q.push({
        path,
        isQueued: true,
        isActive: false,
        url: `/__app.html?${optionsToQuery(options)}`,
        key: path + Date.now(),
        options,
      })
      return q
    })
    updateQueue()
  }

  function updateQueue({ prevPath } = {}) {
    queue.update(q => {
      const prevFetches = q.filter(q => q.path === prevPath) || []
      prevFetches.forEach(prevFetch => {
        prevFetch.isActive = false
        prevFetch.isQueued = false
      })
      while (fetchNext(q)) {}
      return q
    })
  }

  function fetchNext(q) {
    const freeSpots = iframeNum > q.filter(q => q.isActive).length
    const nextFetch = q.find(q => q.isQueued)
    if (freeSpots && nextFetch) {
      nextFetch.isQueued = false
      nextFetch.isActive = true
      setTimeout(() => {
        nextFetch.isActive = false
        queue.update(q => q)
      }, nextFetch.options.timeout * 1000)
      return true
    }
    return false
  }

  function optionsToQuery(options) {
    return Object.entries(options).reduce((q, [key, val]) => {
      const delimiter = q ? '&' : ''
      return `${q + delimiter}__routify_${key}=${val}`
    }, '')
  }
</script>

<script>
  var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
  var eventer = window[eventMethod]
  var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message'

  // Listen to message from child window
  eventer(
    messageEvent,
    function({ data }) {
      const { path } = data
      updateQueue({ prevPath: path })
    },
    false
  )
</script>

<div id="__routify_iframes" style="display:none">
  {#each $actives as prefetch (prefetch.key)}
    <iframe src={prefetch.url} frameborder="0" title="routify prefetcher" />
  {/each}
</div>
