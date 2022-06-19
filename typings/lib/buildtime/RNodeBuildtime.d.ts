/**
 * @extends RNode<typeof import('./RoutifyBuildtime')['RoutifyBuildtime']>
 */
export class RNodeBuildtime extends RNode<typeof import("./RoutifyBuildtime").RoutifyBuildtime> {
    constructor(name: string, module: LoadSvelteModule, instance: import("./RoutifyBuildtime").RoutifyBuildtime);
    /** @type {RFile} */
    file: RFile;
    #private;
}
import { RNode } from "../common/RNode.js";
