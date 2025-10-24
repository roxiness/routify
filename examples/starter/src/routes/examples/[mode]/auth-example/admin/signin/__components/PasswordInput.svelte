<script>
    let showPassword = false
    export let value = ''
</script>

<div>
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
</div>

<style>
    input[type='checkbox'] {
        display: none;
    }
    span {
        position: absolute;
        right: 0.7rem;
        top: -0.1rem;
        cursor: pointer;
    }
    label {
        position: relative;
    }
    label:has(input:checked) span.unchecked {
        display: none;
    }
    /* if not checked */
    label:has(input:not(:checked)) span.checked {
        display: none;
    }
</style>
