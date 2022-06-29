import { RNode } from '../common/RNode.js'
import { RoutifyBuildtime } from './RoutifyBuildtime.js'

/**
 * @extends {RNode<RoutifyBuildtime>}
 */
export class RNodeBuildtime extends RNode {
    /** @type {RFile} */
    file

    /** @type {String} */
    asyncModule

    /**
     * @param {string} name
     * @param {string} module
     * @param {RoutifyBuildtime} instance
     */
    constructor(name, module, instance) {
        super(name, module, instance)
    }
}
