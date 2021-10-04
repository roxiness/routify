/** @returns {Partial<RoutifyRuntime>} */
export class RoutifyRuntime extends Routify {
    constructor(options: any);
    /**@type {Router[]} routers this instance belongs to */
    routers: Router[];
    options: any;
    utils: UrlParamUtils;
    global: import("../Global/Global.js").Global;
    log: any;
}
import { Routify } from "../../common/Routify.js";
import { UrlParamUtils } from "./UrlParamUtils.js";
