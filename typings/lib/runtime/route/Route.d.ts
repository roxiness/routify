export class Route {
    /**
     * @param {Router} router
     * @param {string} url
     * @param {UrlState} mode
     * @param {Object} state a state to attach to the route
     */
    constructor(router: Router, url: string, mode: UrlState, state: any);
    /** @type {RouteFragment[]} */
    allFragments: RouteFragment[];
    /** @type {RouteFragment[]} only fragments with components */
    get fragments(): RouteFragment[];
    /** @type {Promise<{route: Route}>} */
    loaded: Promise<{
        route: Route;
    }>;
    /** @type {RoutifyLoadReturn} */
    load: RoutifyLoadReturn;
    router: import("../index.js").RouterClass;
    url: string;
    mode: UrlState;
    state: any;
    log: any;
    get params(): any;
    loadRoute(): Promise<{
        route: Route;
    }>;
    /**
     * converts async module functions to sync functions
     */
    loadComponents(): Promise<boolean>;
    runPreloads(): Promise<boolean | Route>;
    runGuards(): Promise<boolean>;
    runBeforeUrlChangeHooks(): Promise<any>;
    /**
     * creates fragments. A fragment is the section between each / in the URL
     */
    _createFragments(): RouteFragment[];
}
import { RouteFragment } from "./RouteFragment.js";
