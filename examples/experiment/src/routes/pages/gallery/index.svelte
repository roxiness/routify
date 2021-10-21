<script>
    import { Router } from '@roxi/routify'
    export let context
    let instance, router
    const galcontentNode = context.node.traverse('../galcontent')
    $: console.log('instance', instance)
    $: console.log('router', router)
    console.log('galcontentNode', galcontentNode)
</script>

<h1>Gallery</h1>

r
<Router rootNode={galcontentNode} name="box" bind:instance bind:router />
/r
