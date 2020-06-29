<script>
  import { url } from "@sveltech/routify";
  export let data;
</script>

<style>
  .item {
    display: inline-block;
    width: 50%;
    height: 128px;
  }
</style>

<div class="items">
  {#each data as item}
    <a href={$url('../:id', { id: item.id })} class="item">
      {#each Object.entries(item).slice(0, 3) as [name, value]}
        <div>
          <b>{name}:</b>
          {value}
        </div>
      {/each}
    </a>
  {/each}
</div>
