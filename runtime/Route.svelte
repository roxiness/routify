<script>
  import { setContext, getContext } from 'svelte'
  import * as internals from 'svelte/internal'
  import { demandObject, suppressWarnings } from './scripts.js'

  export let layouts = [],
    scoped = {}
  let scopeToChild

  
  $: [layout, ...remainingLayouts] = layouts

  const { ...context } = getContext('routify')
  setContext('routify', context)
  $: context.component = layout
</script>

<svelte:component this={layout.component()} let:scoped={scopeToChild} {scoped}>
  {#if remainingLayouts.length}
    <svelte:self
      layouts={remainingLayouts}
      scoped={{ ...scoped, ...scopeToChild }} />
  {/if}
</svelte:component>
