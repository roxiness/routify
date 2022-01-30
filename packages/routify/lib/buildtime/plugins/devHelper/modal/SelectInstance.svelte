<script>
    export let instances
    export let instance
</script>

<select bind:value={instance}>
    {#each instances as instance, index}
        <option value={instance}>{index + 1}</option>
    {/each}
</select>
