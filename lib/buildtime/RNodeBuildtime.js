import { RNode } from '../common/RNode.js'

/**
 * @extends RNode<typeof import('./RoutifyBuildtime')['RoutifyBuildtime']>
 */
export class RNodeBuildtime extends RNode {
    /** @type {RFile} */
    file

    /**
     * @param {string} name
     * @param {string} module
     * @param {RoutifyBuildtime} instance
     */
    constructor(name, module, instance) {
        super(name, module, instance)
    }
}
