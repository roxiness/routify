<script>
    import Links from './Links.svelte'
    import Icon from '#cmp/Icon.svelte'
    let scrollY
</script>

<nav class:scrollY>
    <div class="container">
        <a href="/">
            <img class="brand" src="/assets/routify3.svg" />
        </a>
        <div class="middle">
            <Links />
        </div>
        <div
            class="right"
            style="text-align: right; font-weight: bold; color: var(--color-grey-500)">
            <Icon name="IconSearch" />
            Search...
        </div>
    </div>
</nav>
<div class="filler" />

<svelte:window bind:scrollY />

<style>
    .filler {
        height: var(--spacing-8);
    }
    nav {
        position: fixed;
        z-index: 1;
        width: 100%;
        height: var(--spacing-8);
        align-items: center;
        display: flex;
        background: white;
        border-bottom: solid 1px white;
        transition: all 0.2s;
    }
    nav.scrollY {
        box-shadow: 0 0 18px -6px rgba(0, 0, 0, 0.2);
        border-bottom: solid 1px #ddd;
    }

    .brand {
        height: 56px;
    }
    .spacer {
        width: var(--spacing-4);
    }
    .container {
        grid-template-columns: var(--left-nav) auto auto;
        display: grid;
    }
    .middle {
        display: flex;
        padding-left: var(--spacing-8);
        align-items: center;
    }
    .middle :global(a) {
        font-size: 20px;
        color: var(--color-grey-700);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 var(--spacing-2);
        /* font-weight: 500; */
    }
    .middle :global(a:first-of-type) {
        margin-left: 0;
    }
    .middle :global(a.icon) {
        opacity: 0.5;
        padding: 0;
        margin: 0 8px;
    }
    .middle a:hover {
        opacity: 1;
    }
    :global(.mobile) .middle,
    :global(.mobile) .right,
    :global(.tablet) .middle,
    :global(.tablet) .right {
        display: none;
    }
    :global(.mobile) .brand,
    :global(.tablet) .brand {
        text-align: center;
    }
    :global(.mobile) .container,
    :global(.tablet) .container {
        grid-template-columns: auto;
        justify-content: center;
    }
</style>
