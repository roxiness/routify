export class Route {
    /**
     * @param {Router} router
     * @param {string} url
     * @param {UrlState} mode
     */
    constructor(router: Router, url: string, mode: UrlState);
    /** @type {RouteFragment[]} */
    fragments: RouteFragment[];
    router: import("../index.js").RouterClass;
    url: string;
    mode: UrlState;
    get params(): any;
    /**
     * converts async module functions to sync functions
     */
    loadComponents(): Promise<void>;
    runPreloads(): Promise<void>;
    runGuards(): Promise<boolean>;
    runBeforeUrlChangeHooks(): Promise<boolean>;
    /**
     * creates fragments. A fragment is the section between each / in the URL
     */
    _createFragments(): RouteFragment[];
}
import { RouteFragment } from "./RouteFragment.js";
