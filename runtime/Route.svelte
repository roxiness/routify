<script>
  import { setContext, getContext } from "svelte";
  import * as internals from "svelte/internal";
  import { demandObject, suppressWarnings } from "./scripts.js";

  export let layouts = [],
    scopeFromParent = {};
  let scopeToChild;

  $: scoped = Object.assign({}, scopeFromParent, scopeToChild);
  $: [layout, ...remainingLayouts] = layouts;

  $: layout && updateContext();

  function updateContext() {
    const _routify = getContext("routify");
    const routify = JSON.parse(JSON.stringify(_routify));
    routify.parent = _routify;
    routify.component = layout;
    setContext("routify", routify);
  }
</script>

<svelte:component this={layout.component()} let:scoped={scopeToChild} {scoped}>
  {#if remainingLayouts.length}
    <svelte:self
      layouts={remainingLayouts}
      scopeFromParent={{ ...scopeFromParent, ...scopeToChild }} />
  {/if}
</svelte:component>
