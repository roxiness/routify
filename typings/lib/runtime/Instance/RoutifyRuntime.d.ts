/** @returns {Partial<RoutifyRuntime>} */
export class RoutifyRuntime {
    /** @param {Partial<RoutifyRuntime>} options */
    constructor(options: Partial<RoutifyRuntime>);
    mode: string;
    /** @type {RNodeRuntime[]} */
    nodeIndex: RNodeRuntime[];
    Node: typeof RNodeRuntime;
    /**@type {Router[]} routers this instance belongs to */
    routers: Router[];
    superNode: RNodeRuntime;
    /** @type {Partial<RoutifyRuntime>} */
    options: Partial<RoutifyRuntime>;
    utils: UrlParamUtils;
    global: import("../Global/Global.js").Global;
    log: any;
    /**
     * @param {string} name relative path for the node
     * @param {any|string} module svelte component
     * @returns {RNodeRuntime}
     */
    createNode(name: string, module: any | string): RNodeRuntime;
}
import { RNodeRuntime } from "./RNodeRuntime.js";
import { UrlParamUtils } from "./UrlParamUtils.js";
