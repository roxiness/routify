<script>
    import { Router } from '@roxi/routify'
    let leftRouter = {}
    let rightRouter = {}
    let inputLeft = ''
    let inputRight = ''
    $: leftActiveUrl = leftRouter.activeUrl
    $: rightActiveUrl = rightRouter.activeUrl

    $: setInputLeft(leftActiveUrl && $leftActiveUrl.url)
    $: setInputRight(rightActiveUrl && $rightActiveUrl.url)
    const setInputLeft = val => (inputLeft = val)
    const setInputRight = val => (inputRight = val)

    const submitLeft = () =>
        leftActiveUrl.set(inputLeft, 'pushState', 'internal')

    const submitRight = () =>
        rightActiveUrl.set(inputRight, 'pushState', 'internal')
</script>

<h1>Multi router</h1>

<div class="split">
    <div class="left">
        <form on:submit|preventDefault={submitLeft}>
            <input type="text" bind:value={inputLeft} />
        </form>
        <Router name="nested1" bind:router={leftRouter} />
    </div>
    <div class="right">
        <form on:submit|preventDefault={submitRight}>
            <input type="text" bind:value={inputRight} />
        </form>
        <Router name="nested2" bind:router={rightRouter} />
    </div>
</div>

<style>
    .split {
        display: flex;
    }
    .split > * {
        flex-grow: 1;
        flex-basis: 0;
        margin: 0 16px;
    }
    input {
        background: white;
    }
</style>
