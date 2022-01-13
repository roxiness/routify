<script>
    import { setContext } from 'svelte'
    import { writable } from 'svelte/store'
    import Header from './Header.svelte'
    import InstanceTree from './InstanceTree.svelte'
    import NodeInfo from './NodeInfo.svelte'
    import SelectInstance from './SelectInstance.svelte'

    export let hide

    const { instances } = __routify
    let instance = instances[0]
    let node = writable(instance.nodeIndex[0])
    setContext('node', node)
</script>

<div class="helper">
    <header>
        <Header bind:hide />
    </header>
    <div class="instance">
        <SelectInstance bind:instance {instances} />
        <InstanceTree {instance} />
    </div>
    <div class="node-info">
        <NodeInfo {node} />
    </div>
    <footer />
</div>

<style>
    .helper {
        border-top-left-radius: var(--radius-lg);
        background: white;
        display: grid;
        grid-template-areas:
            'header header'
            'instance node-info'
            'footer footer';
        grid-template-rows: auto minmax(0, 1fr) auto;
        grid-auto-rows: auto;
        width: 700px;
        height: 400px;
        box-shadow: 8px 8px 16px 0 black;
    }
    header {
        border-top-left-radius: var(--radius-lg);
        background: var(--color-pink-500);
        height: 32px;
        line-height: 32px;
        padding-left: 16px;
        grid-area: header;
        font-weight: 700;
        color: white;
    }
    footer {
        background: var(--color-pink-500);
        height: var(--size-1);
        grid-area: footer;
    }
    .instance {
        grid-area: instance;
        width: 200px;
    }
    .node-info {
        grid-area: node-info;
        width: 500px;
        border-left: 2px solid var(--color-grey-300);
    }
    .instance,
    .node-info {
        overflow: auto;
        padding: 16px 20px;
        box-sizing: border-box;
    }
</style>
