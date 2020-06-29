<script>
  import { leftover } from "@sveltech/routify";
  import list from "./_list.svelte";
  import update from "./_update.svelte";
  import view from "./_view.svelte";
  export let data;
  const components = { list, update, view };

  $: [id, action = "view"] = $leftover.split("/");
  $: component = (id && components[action]) || list;
</script>

<div>
  <div style="width: 512px; margin: auto;" class="card shadow">
    <h1 style="text-align: center; margin-top: -8px">CrudWidget</h1>
    <svelte:component this={component} {data} {id} />
  </div>
</div>
