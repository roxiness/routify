<script>
  export let components = [];
  export let route

  let props = {}  

  $: component = components.shift();
</script>


<svelte:component this={component} {route}}>
  {#if components.length}
    <svelte:self {components} {route}  />
  {/if}
</svelte:component>
