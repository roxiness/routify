/**
 * @extends {Routify<typeof RNodeRuntime>}
 */
export class RoutifyRuntime extends Routify<typeof RNodeRuntime> {
    constructor(options: any);
    NodeConstructor: typeof RNodeRuntime;
    mode: string;
    /**@type {Router[]} routers this instance belongs to */
    routers: Router[];
    /** @type {Object<string, RNodeRuntime>} */
    rootNodes: {
        [x: string]: RNodeRuntime;
    };
    options: any;
    global: import("../Global/Global.js").AppInstance;
    log: import("consolite").ConsoliteLogger;
}
import { RNodeRuntime } from "./RNodeRuntime.js";
import { Routify } from "../../common/Routify.js";
