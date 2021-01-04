<script>
  import { prefetch, layout, url } from '@roxi/routify'

  let cache_time = 60
  function prefetchPath(e) {
    prefetch(e, {
      cache_time,
    })
  }
</script>

<div>
  cachetime 
  <input type="text" class="cachetime" bind:value={cache_time} />
</div>

<h3>Prefetch an url</h3>
{#each $layout.parent.children as child}
  <div id="prefetch">
    <button class={child.title} on:click={prefetchPath(child.path)}>
      {child.path}
    </button>
    <a href={$url(child.path)}>goto{child.path}</a>
  </div>
{/each}

<a href="https://google.com">google.com</a>

<!-- routify:options index=false -->
