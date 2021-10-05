import { RNode } from '../common/RNode.js'
import { RoutifyBuildtime } from './RoutifyBuildtime.js'

export class RNodeBuildtime extends RNode {
    Instance = RoutifyBuildtime

    /** @type {RFile} */
    file

    /**
     * @param {string} name
     * @param {MixedModule} module
     * @param {any} instance
     */
    constructor(name, module, instance) {
        super(name, module, instance)
        Object.defineProperty(this, 'Instance', { enumerable: false })
    }
}
