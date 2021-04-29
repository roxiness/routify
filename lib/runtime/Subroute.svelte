<script>
    import Component from './Component.svelte'
    export let router
    $: ({ activeRoute, activeUrl, instance } = $router)
    $: ({ fragments } = $activeRoute)
</script>

{#if instance.options.debugger}
    <main>
        <div class="bar">
            <strong>path:</strong>
            <span class="url">
                {$activeUrl}
            </span>
            <span class="filepath">
                {fragments[0].node.file.path}
            </span>
        </div>
        <Component {instance} {fragments} />
    </main>
{:else}
    <Component {instance} {fragments} />
{/if}

<style>
    * {
        font-family: sans-serif;
    }
    main {
        position: relative;
        padding: 30px;
        border: 2px solid #eee;
    }
    .bar {
        display: grid;
        grid-template-columns: min-content auto min-content;
    }
    .filepath {
        text-align: right;
    }
    div {
        position: absolute;
        height: 30px;
        line-height: 30px;
        background: #eee;
        top: 0;
        left: 0;
        right: 0;
        padding: 0 16px;
    }
</style>
