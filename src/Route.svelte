<script>
  import { demandObject, suppressWarnings } from "./scripts.js";
  import { options } from "generatedRoutes.js";
  export let url, route, routes;
  export let components = [];
  export let rootScope = {};
  export let layoutScope = {};

  $: rootScope = Object.assign({}, rootScope, layoutScope);

  $: getComponent = components[0]
  $: remainingComponents = components.slice(1)

  $: props = { url, route, routes, scoped: { ...rootScope }, ...rootScope };
  $: childProps = { url, route, routes, rootScope, components: remainingComponents };

  $: if (!options.unknownPropWarnings) suppressWarnings(Object.keys(props));
</script>

{#await getComponent() then cmp}
  <svelte:component this={cmp} {...props} let:scoped={layoutScope}>
    {#if remainingComponents.length && demandObject(layoutScope)}
      <svelte:self {...childProps} {layoutScope} />
    {/if}
  </svelte:component>
{/await}
