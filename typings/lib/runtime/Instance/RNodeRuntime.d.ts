/// <reference types="svelte/types/runtime/ambient" />
/**
 * @extends RNode<typeof import('./RoutifyRuntime')['RoutifyRuntime']>
 */
export class RNodeRuntime extends RNode<typeof import("./RoutifyRuntime").RoutifyRuntime> {
    /**
     * @param {string} name
     * @param {ReservedCmpProps} module
     * @param {RoutifyRuntime} instance
     * @param {LoadSvelteModule} asyncModule
     */
    constructor(name: string, module: ReservedCmpProps, instance: RoutifyRuntime, asyncModule: LoadSvelteModule);
    /** @returns {this[]} */
    get pages(): RNodeRuntime[];
    /** @ts-ignore SvelteComponentConstructor is only available in VSCode */
    /** @returns {Promise<SvelteComponentDev<*, *>>} */
    getRawComponent(): Promise<SvelteComponentDev<any, any>>;
    loadModule(): Promise<ReservedCmpProps>;
    /** @returns {() => Node} */
    get component(): () => Node;
    /**
     * @param {object} snapshotRoot
     */
    importTree: (snapshotRoot: object) => RNodeRuntime;
    get _fallback(): any;
    #private;
}
import { RNode } from "../../common/RNode.js";
import Node from "*.svelte";
