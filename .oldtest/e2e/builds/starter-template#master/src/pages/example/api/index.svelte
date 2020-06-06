<script>
  import { url } from "@sveltech/routify";
  export let scoped;
  const { movies } = scoped;
</script>

<div style="text-align: center">
  {#each movies as [showId, title]}
    <h3>
      <a href={$url('../:showId', { showId })}>{title}</a>
    </h3>
  {/each}
</div>
