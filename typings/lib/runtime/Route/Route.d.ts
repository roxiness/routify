export class Route {
    /**
     * @param {Router} router
     * @param {string} url
     * @param {UrlState} mode
     * @param {Object} state a state to attach to the route
     */
    constructor(router: Router, url: string, mode: UrlState, state?: any);
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
    hash: string;
    log: any;
    get params(): any;
    get leaf(): RouteFragment;
    get isPending(): boolean;
    loadRoute(): Promise<{
        route: Route;
    }>;
    /**
     * converts async module functions to sync functions
     */
    loadComponents(): Promise<boolean>;
    runPreloads(): Promise<boolean | Route>;
    runBeforeUrlChangeHooks(): Promise<any>;
    /**
     * @param {RNodeRuntime} node the node that corresponds to the fragment
     * @param {String=} urlFragment a fragment of the url (fragments = url.split('/'))
     * @param {Object<string, any>=} params
     */
    createFragment(node: RNodeRuntime, urlFragment?: string | undefined, params?: {
        [x: string]: any;
    } | undefined): RouteFragment;
    /**
     * creates fragments. A fragment is the section between each / in the URL
     */
    _createFragments(): RouteFragment[];
}
import { RouteFragment } from "./RouteFragment.js";
