<script>
  import { setContext, getContext } from "svelte";
  import * as internals from "svelte/internal";
  import { demandObject, suppressWarnings } from "./scripts.js";

  export let layouts = [],
    scopeFromParent = {};
  let scopeToChild;

  $: scoped = Object.assign({}, scopeFromParent, scopeToChild);
  $: [layout, ...remainingLayouts] = layouts;

  $: console.log("layout", layout);

  $: routify = getContext("routify") || {};
  $: routify.route = layout;
  $: setContext("routify", routify);
</script>

{#await layout.component() then cmp}
  <svelte:component this={cmp} let:scoped={scopeToChild} {scoped}>
    {#if remainingLayouts.length}
      <svelte:self
        layouts={remainingLayouts}
        scopeFromParent={{ ...scopeFromParent, ...scopeToChild }} />
    {/if}
  </svelte:component>
{/await}
