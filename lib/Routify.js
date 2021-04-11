import { Node } from './Node.js'
import { deepAssign } from './utils.js'


export class Routify {
    constructor(options) {
        this.options = deepAssign(this.options, options)
    }

    /** @type {Node[]} */
    nodeIndex = []

    createNode(name) {
        return new Node(name, this)
    }

    rootNode = new Node('_ROOT', this)

    options = {
        routifyDir: '.routify',
        filemapper: {
            moduleFiles: ['_module.svelte', '_reset.svelte'],
            resetFiles: ['_reset.svelte'],
            routesDir: {
                default: ''
            }
        }
    }
}