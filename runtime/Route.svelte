<script>
  import { setContext, getContext } from "svelte";
  import { demandObject, suppressWarnings } from "./scripts.js";

  export let url, route, routes;
  export let components = [];
  export let rootScope = {};
  export let layoutScope = {};
  export let _routeOptions = {};

  $:console.log($$props)

  $: rootScope = Object.assign({}, rootScope, layoutScope);

  $: [getComponent, ...remainingComponents] = components;

  $: routerProps = { url, route, routes, _routeOptions };

  $: props = Object.assign(
    {},
    routerProps,
    { scoped: Object.assign({}, rootScope) },
    rootScope
  );

  $: if (!_routeOptions.unknownPropWarnings)
    suppressWarnings(Object.keys(props));
</script>

{#await getComponent() then cmp}
  <svelte:component this={cmp} {...props} let:scoped={layoutScope}>
    {#if remainingComponents.length && demandObject(layoutScope)}
      <svelte:self
        {...routerProps}
        components={remainingComponents}
        {layoutScope} />
    {/if}
  </svelte:component>
{/await}
