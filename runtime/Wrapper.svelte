<script>
    import Component from './Component.svelte'
    export let instance
    const { urlHandler, activePathNodes } = instance
    $: pathNodes = $activePathNodes
</script>

{#if instance.options.debugger}
    <main>
        <div class="bar">
            <strong>path:</strong>
            <span class="url">
                {$urlHandler}
            </span>
            <span class="filepath">
                {pathNodes[0].node.file.path}
            </span>
        </div>
        <Component {instance} {pathNodes} />
    </main>
{:else}
    <Component {instance} {pathNodes} />
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
