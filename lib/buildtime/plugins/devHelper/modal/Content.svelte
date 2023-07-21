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
