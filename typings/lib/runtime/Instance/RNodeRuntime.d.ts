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
    /**
     * Returns the title of the node. Looks for meta.title, falls back to capitalized name
     * Can be transformed with the router transformTitle hook
     * @returns {string}
     */
    get title(): string;
    get pagesWithIndex(): RNodeRuntime[];
    get hasComponent(): boolean;
    /** @ts-ignore SvelteComponentConstructor is only available in VSCode */
    /** @returns {Promise<SvelteComponentDev>} */
    getRawComponent(): Promise<SvelteComponentDev>;
    asyncLoadModule(): Promise<ReservedCmpProps>;
    /**
     * @returns {Promise<ReservedCmpProps|undefined> | ReservedCmpProps | undefined }
     */
    loadModule(): Promise<ReservedCmpProps | undefined> | ReservedCmpProps | undefined;
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
