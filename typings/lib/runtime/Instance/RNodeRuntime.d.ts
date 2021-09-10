/// <reference types="svelte/types/runtime/ambient" />
/**
 * @extends {RNode<RoutifyRuntime>}
 */
export class RNodeRuntime extends RNode<import("./RoutifyRuntime.js").RoutifyRuntime> {
    constructor(name: string, module: MixedModule, instance: import("./RoutifyRuntime.js").RoutifyRuntime);
    set regex(arg: RegExp);
    get regex(): RegExp;
    /** @returns {Promise<SvelteComponentConstructor<*, *>>} */
    get rawComponent(): Promise<any>;
    /** @returns {() => Node} */
    get component(): () => Node;
    get _fallback(): any;
    #private;
}
import { RNode } from "../../common/RNode.js";
import Node from "*.svelte";
