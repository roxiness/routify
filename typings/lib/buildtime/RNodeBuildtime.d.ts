/**
 * @extends RNode<typeof import('./RoutifyBuildtime')['RoutifyBuildtime']>
 */
export class RNodeBuildtime extends RNode<typeof import("./RoutifyBuildtime").RoutifyBuildtime> {
    constructor(name: string, module: any, instance: import("./RoutifyBuildtime").RoutifyBuildtime);
    /** @type {RFile} */
    file: RFile;
}
import { RNode } from "../common/RNode.js";
