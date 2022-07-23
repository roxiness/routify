/// <reference types="svelte/types/runtime/ambient.js" />
/**
 * @extends {RNode<RoutifyRuntime>}
 */
export class RNodeRuntime extends RNode<RoutifyRuntime> {
    /**
     * @param {string} name
     * @param {ReservedCmpProps} module
     * @param {RoutifyRuntime} instance
     * @param {LoadSvelteModule=} asyncModule
     */
    constructor(name: string, module: ReservedCmpProps, instance: RoutifyRuntime, asyncModule?: LoadSvelteModule | undefined);
    /** @type {LoadSvelteModule} */
    asyncModule: LoadSvelteModule;
    /** @type {ReservedCmpProps} */
    module: ReservedCmpProps;
    get pages(): RNodeRuntime[];
    get pagesWithIndex(): RNodeRuntime[];
    /** @ts-ignore SvelteComponentConstructor is only available in VSCode */
    /** @returns {Promise<import('svelte/internal').SvelteComponentDev>} */
    getRawComponent(): Promise<import('svelte/internal').SvelteComponentDev>;
    loadModule(): Promise<ReservedCmpProps>;
    /**
     * Returns in a sync/async component in a synchronous wrapper
     * @returns {() => Node}
     **/
    get component(): () => Node;
    /**
     * @param {object} snapshotRoot
     */
    importTree: (snapshotRoot: object) => RNodeRuntime;
    get _fallback(): any;
}
import { RoutifyRuntime } from "./RoutifyRuntime.js";
import { RNode } from "../../common/RNode.js";
import Node from "*.svelte";
