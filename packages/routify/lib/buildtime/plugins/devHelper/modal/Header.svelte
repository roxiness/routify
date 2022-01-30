<script>
    export let hide

    let level = __routify.log.level
    const logLevels = {
        default: 3,
        error: 1,
        warn: 2,
        debug: 4,
    }

    $: console.log(level)
    $: if (level != __routify.log.level) {
        __routify.log.level = Number(level)
    }
</script>

<span on:click={hide}> Routify Helper </span>

<select bind:value={level}>
    {#each Object.entries(logLevels) as [name, value]}
        <option {value} selected={level == value}>
            {name}
        </option>
    {/each}
</select>
