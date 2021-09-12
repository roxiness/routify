<script>
    import { Router, Routify } from '@roxi/routify'
    import routes from '../.routify/routes.main.js'
    import moduleRoutes from '../.routify/routes.moduleA.js'

    // create a new instance of Routify. An instance is basically a collection of node trees,
    // which can be accessed through instance.nodeIndex and instance.superNode
    const instance = new Routify({})

    // let's add our generated route tree
    instance.superNode.importTree(routes)

    // for this example we are going use the root node of the main route tree to attach our module to.
    // we named this route tree "main", so its root node will have the id "_main"
    // we could also have resolved the node with custom meta or through instance.superNode.
    const parentNode = instance.nodeIndex.find(node => node.id === '_main')

    // we want it to be accessible at ./external-module.
    // if we had left the name out, it would have been available at `./moduleA'.
    // if we wanted to nest it deeper, we would have used a different parent node.
    parentNode.importTree({ name: 'external-module', ...moduleRoutes })
</script>

<Router {instance} />
