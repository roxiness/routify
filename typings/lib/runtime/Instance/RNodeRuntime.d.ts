/// <reference types="svelte/types/runtime/ambient" />
export class RNodeRuntime extends RNode {
    set regex(arg: RegExp);
    get regex(): RegExp;
    /** @returns {this["Instance"]["prototype"]['superNode'][]} */
    get pages(): RNodeRuntime[];
    /** @ts-ignore SvelteComponentConstructor is only available in VSCode */
    /** @returns {Promise<SvelteComponentConstructor<*, *>>} */
    get rawComponent(): Promise<any>;
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
