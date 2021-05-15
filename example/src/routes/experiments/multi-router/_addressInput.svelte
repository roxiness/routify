<script>
    export let activeUrl
    let input = ''

    $: if (activeUrl) onUrlChange($activeUrl.url)

    const onUrlChange = val => (input = val)
    const onSubmit = () => activeUrl.set(input, 'pushState', 'internal')
</script>

<form on:submit|preventDefault={onSubmit}>
    <input type="text" bind:value={input} />
</form>

<style>
    input {
        background: white;
    }
</style>
