<script>
    let showPassword = false
    export let value = ''
</script>

{#if showPassword}
    <input name="password" bind:value />
{:else}
    <input name="password" bind:value type="password" />
{/if}
<label>
    <span class="checked">hide</span>
    <span class="unchecked">show</span>
    <input type="checkbox" bind:checked={showPassword} />
</label>
