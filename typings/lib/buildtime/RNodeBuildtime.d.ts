/**
 * @extends {RNode<RoutifyBuildtime>}
 */
export class RNodeBuildtime extends RNode<RoutifyBuildtime> {
    /**
     * @param {string} name
     * @param {string} module
     * @param {RoutifyBuildtime} instance
     */
    constructor(name: string, module: string, instance: RoutifyBuildtime);
    /** @type {RFile} */
    file: RFile;
    /** @type {String} */
    asyncModule: string;
}
import { RoutifyBuildtime } from "./RoutifyBuildtime.js";
import { RNode } from "../common/RNode.js";
