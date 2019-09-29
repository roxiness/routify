<script>
  export let components = [];
  export let route;
  export let parentScope = {};
  let layoutScope = {};

  $: component = components.shift();

  function isObject(obj) {
    const isObj = Object.prototype.toString.call(obj) === "[object Object]";
    if (isObj || !obj) return true;
    else
      throw new Error(
        `"${obj}" is not an object. "scoped" prop must an object`
      );
  }
</script>

<svelte:component
  this={component}
  {route}
  let:scoped={layoutScope}
  scoped={parentScope}
  {...parentScope}
  }>
  {#if components.length && isObject(layoutScope)}
    <svelte:self
      {components}
      {route}
      parentScope={{ ...layoutScope, ...parentScope }} />
  {/if}
</svelte:component>
