<script>
  import { scale, fly } from 'svelte/transition'
  import BaseTransition from './BaseTransition.svelte'
  import { getContext } from 'svelte'
  export let scoped = {}
  const ctx = getContext('routify')
  
  $: width = scoped.width || $ctx.parentNode.getBoundingClientRect().width
  
  $: configs = [
    {
      // New and old route are identical, do nothing
      condition: c => c.routes[0] === c.routes[1],
      transition: () => {},
    },
    {
      condition: c => c.toAncestor,
      transition: scale,
      inParams: { start: 1.2 },
      outParams: { start: 0.8 },
    },
    {
      condition: c => c.toDescendant,
      transition: scale,
      inParams: { start: 0.8 },
      outParams: { start: 1.2 },
    },
    {
      condition: c => c.toHigherIndex,
      transition: fly,
      inParams: { x: width, duration: 500 },
      outParams: { x: -width, duration: 500 },
    },
    {
      condition: c => c.toLowerIndex,
      transition: fly,
      inParams: { x: -width, duration: 500 },
      outParams: { x: width, duration: 500 },
    },
    {
      // No matching config. We don't want a transition
      condition: () => true,
      transition: () => {},
    },
  ]
</script>

<BaseTransition {configs} {...scoped}>
  <slot />
</BaseTransition>
