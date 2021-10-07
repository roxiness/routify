import { RNode } from '../common/RNode.js'

/**
 * @extends RNode<typeof import('./RoutifyBuildtime')['RoutifyBuildtime']>
 */
export class RNodeBuildtime extends RNode {
    /** @type {RFile} */
    file
}
