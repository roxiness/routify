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
    fragments: RouteFragment[];
    /** @type {RoutifyLoadReturn} */
    load: RoutifyLoadReturn;
    router: import("../index.js").RouterClass;
    url: string;
    mode: UrlState;
    state: any;
    hash: string;
    search: string;
    params: any;
    log: any;
    get leaf(): RouteFragment;
    get isPendingOrPrefetch(): any;
    loadRoute(): Promise<boolean>;
    /**
     * converts async module functions to sync functions
     */
    loadComponents(): Promise<boolean>;
    runPreloads(): Promise<boolean | Route>;
    runBeforeUrlChangeHooks(): Promise<any>;
    get meta(): {};
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
    _createFragments(pathname: any): RouteFragment[];
    _createUrl(fragments: any): string;
}
import { RouteFragment } from "./RouteFragment.js";
