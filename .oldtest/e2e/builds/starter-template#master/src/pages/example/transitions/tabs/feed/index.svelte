<script>
  import { url } from "@sveltech/routify";
</script>

<div style="padding-top: 20px">
  <h1>Feed</h1>
</div>

{#each new Array(10) as item, id}
  <a class="card" href={$url('../:id', { id })}>
    <h3 class="item">{id}</h3>
  </a>
{/each}
