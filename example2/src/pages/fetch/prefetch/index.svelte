<script>
  import { prefetch, layout, url } from '@sveltech/routify'

  function prefetchPath(e) {
    prefetch(e)
  }
  console.log($layout.parent.children)
</script>

<h3>Prefetch an url</h3>
{#each $layout.parent.children as child}
  <div id="prefetch">
    <button class="{child.title}" on:click={prefetchPath(child.path)}>{child.path}</button>
    <a href="{$url(child.path)}">goto{child.path}</a>
  </div>
{/each}

<a href="https://google.com">google.com</a>

<!-- routify:options index=false -->
