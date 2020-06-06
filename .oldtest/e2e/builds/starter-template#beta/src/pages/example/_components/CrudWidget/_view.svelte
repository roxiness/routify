<script>
  import { url } from "@sveltech/routify";
  export let data = [],
    id;
  $: item = data.filter(item => item.id == id)[0];
</script>

<div>
  <div>
    {#each Object.entries(item) as [name, value]}
      <div>
        <b>{name}:</b>
        {value}
      </div>
    {/each}
  </div>
  <br />
  <a href={$url('../', { id })}>[Back]</a>
  <a href={$url('../:id/update', { id })}>[Update]</a>
</div>
