<script>
  import { demandObject, suppressWarnings } from "./scripts.js";
  import { options } from "generatedRoutes.js";
  export let url, route, routes;
  export let components = [];
  export let rootScope = {};
  export let layoutScope = {};

  $: rootScope = Object.assign({}, rootScope, layoutScope);

  $: component = components.shift();
  $: components = components.slice(0); //clone or components starts disappearing on every layoutScope update

  $: props = Object.assign({ url, route, routes, scoped: Object.assign({}, rootScope)}, rootScope);
  $: childProps = { url, route, routes, rootScope, components };

  $: if (!options.unknownPropWarnings) suppressWarnings(Object.keys(props));
</script>

<svelte:component this={component} {...props} let:scoped={layoutScope}>
  {#if components.length && demandObject(layoutScope)}
    <svelte:self {...childProps} {layoutScope} />
  {/if}
</svelte:component>
