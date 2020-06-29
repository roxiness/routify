<script>
  import { goto, params, context } from "@sveltech/routify";
  
  export let scoped;
  const { send, receive, activeKey } = scoped;
  const component = $context.component
  $: componentChanged = component !== $context.component
  $: key = component.params.key
  $: $activeKey = !componentChanged && key || 'none'
</script>

<!-- TODO need to move logic to a page checker in parent layout -->

<div class="container" on:click={() => $goto('../')} >
  <div
    class="modal"
    in:receive|local={{ key: 'modal' }}
    out:send|local={{ key: 'modal' }}>
    {key}
  </div>
</div>
