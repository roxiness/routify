/**
 * @extends RNode<typeof import('./RoutifyBuildtime')['RoutifyBuildtime']>
 */
export class RNodeBuildtime extends RNode<typeof import("./RoutifyBuildtime").RoutifyBuildtime> {
    /**
     * @param {string} name
     * @param {string} module
     * @param {RoutifyBuildtime} instance
     */
    constructor(name: string, module: string, instance: RoutifyBuildtime);
    /** @type {RFile} */
    file: RFile;
    #private;
}
import { RNode } from "../common/RNode.js";
