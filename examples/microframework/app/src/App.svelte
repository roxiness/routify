<script>
    import { Router, url, params } from '@roxi/routify'
    import { instance } from '../.routify/instance.default.js'
    import { instance as moduleAInstance } from '../.routify/instance.moduleA.js'
    // console.log(instance.nodeIndex)
    const child = instance.superNode.children[0].createChild('module-a')
    child.appendChild(moduleAInstance.superNode.children[0])
    console.log(instance.superNode.children[0])
</script>

<Router {instance} />
