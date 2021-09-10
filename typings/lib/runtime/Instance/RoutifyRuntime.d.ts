export class RoutifyRuntime {
    /** @param {Partial<RoutifyRuntime>} options */
    constructor(options: Partial<RoutifyRuntime>);
    mode: string;
    Node: typeof RNodeRuntime;
    /**@type {Router[]} routers this instance belongs to */
    routers: Router[];
    superNode: RNodeRuntime;
    get nodeIndex(): RNodeRuntime[];
    /** @type {Partial<RoutifyRuntime>} */
    options: Partial<RoutifyRuntime>;
    plugins: any[];
    global: import("../Global/Global.js").Global;
    utils: UrlParamUtils;
    log: import("consola").Consola;
    /**
     * @param {string} name relative path for the node
     * @param {any|string} module svelte component
     * @returns {RNodeRuntime}
     */
    createNode(name: string, module: any | string): RNodeRuntime;
    start(): void;
    #private;
}
import { RNodeRuntime } from "./RNodeRuntime.js";
import { UrlParamUtils } from "./UrlParamUtils.js";
