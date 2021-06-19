<script>
    export let payload
    const {meta} = payload.node
</script>

<!-- routify:meta order=false -->
<!-- routify:meta wrf=cmon -->

### Example

**Luke:**
{payload.node.meta.luke.name}


**Darth:**
{#await meta.darth then data}
    {data.name}
{/await}


**Leia:**
{#await meta.leia then data}
    {data.name}
{/await}

