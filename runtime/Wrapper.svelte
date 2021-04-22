<script>
    import Component from './Component.svelte'
    export let instance
    const { urlStore, activePathNodes } = instance
    $: pathNodes = $activePathNodes
</script>

{#if instance.options.debugger}
    <main>
        <div>
            <strong>urlStore:</strong>
            {$urlStore}
        </div>
        <Component {instance} {pathNodes} />
    </main>
{:else}
    <Component {instance} {pathNodes} />
{/if}

<style>
    main {
        position: relative;
        padding: 30px;
        border: 2px solid #eee;
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
