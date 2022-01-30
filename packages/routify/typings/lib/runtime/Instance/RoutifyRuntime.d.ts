/**
 * @extends Routify<typeof import('./RNodeRuntime')['RNodeRuntime']>
 */
export class RoutifyRuntime extends Routify<typeof RNodeRuntime> {
    constructor(options: any);
    /**@type {Router[]} routers this instance belongs to */
    routers: Router[];
    options: any;
    utils: UrlParamUtils;
    global: import("../Global/Global.js").Global;
    log: import("consolite").ConsoliteLogger;
}
import { RNodeRuntime } from "./RNodeRuntime.js";
import { Routify } from "../../common/Routify.js";
import { UrlParamUtils } from "./UrlParamUtils.js";
