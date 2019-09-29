<script>
  export let components = [];
  export let route;
  export let rootScope = {};
  export let layoutScope = {};

  $: rootScope = Object.assign({}, rootScope, layoutScope);

  $: component = components.shift();
  $: components = components.slice(0); //clone or components starts disappearing on every layoutScope update

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
  scoped={rootScope}
  {...rootScope}
  }>
  {#if components.length && isObject(layoutScope)}
    <svelte:self {components} {route} {layoutScope} {rootScope} />
  {/if}
</svelte:component>
