<script>
  import { url, params } from "@sveltech/routify";
  import { getContext } from "svelte";

</script>

<div class="cards">
  {#each Array(12) as item, key}    
      <a class="card" href={$url('./:key', { key })}>
        <div class="content">{key}</div>
      </a>    
  {/each}
</div>

<slot  />
