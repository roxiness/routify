<script context="module">
  import { writable, derived } from 'svelte/store'
  const iframeNum = 2
  let queue = writable([])
  let actives = derived(queue, q => q.filter(q => q.isActive))
  let queued = derived(queue, q => q.filter(q => q.isQueued))
  export function prefetch(path) {
    if (window.routify.prefetched || navigator.userAgent.match('jsdom'))
      return false

    queue.update(q => {
      q.push({
        path,
        isQueued: true,
        isActive: false,
        url: '/app.html?__routify_prefetch=true&__routify_path=' + path,
      })
      return q
    })
    updateQueue()
  }

  function updateQueue({ prevPath } = {}) {
    queue.update(q => {
      const prevFetch = q.find(q => q.path === prevPath)
      if (prevFetch) prevFetch.isActive = false
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
      return true
    }
    return false
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
  {#each $actives as prefetch (prefetch.path)}
    <iframe src={prefetch.url} frameborder="0" title="routify prefetcher" />
  {/each}
</div>
