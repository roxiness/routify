<script>
  export let components = [];
  export let url;
  export let route;
  export let routes;
  export let rootScope = {};
  export let layoutScope = {};

  $: rootScope = Object.assign({}, rootScope, layoutScope);

  $: component = components.shift();
  $: components = components.slice(0); //clone or components starts disappearing on every layoutScope update

  function demandObject(obj) {
    const isObj = Object.prototype.toString.call(obj) === "[object Object]";
    if (isObj || !obj) return true;
    else
      throw new Error(
        `"${obj}" is not an object. "scoped" prop must an object`
      );
  }

  $: props = { url, route, routes, scoped: { ...rootScope }, ...rootScope };
  $: childProps = { url, route, routes, rootScope, components };
</script>

<svelte:component this={component} {...props} let:scoped={layoutScope}>
  {#if components.length && demandObject(layoutScope)}
    <svelte:self {...childProps} {layoutScope} />
  {/if}
</svelte:component>
