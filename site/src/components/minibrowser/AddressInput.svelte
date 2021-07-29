<script>
    let input = ''
    export let activeRoute

    $: if ($activeRoute) updateInput($activeRoute.url)
    const updateInput = val => (input = val)
    const onSubmit = () => $activeRoute.router.url.push(input)
</script>

<form on:submit|preventDefault={onSubmit}>
    <input type="text" bind:value={input} />
</form>

<style>
    input {
        background: white;
    }
</style>
