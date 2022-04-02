export class RouteFragment {
    /**
     * @param {Route} route the route this fragment belongs to
     * @param {RNodeRuntime} node the node that corresponds to the fragment
     * @param {String} urlFragment a fragment of the url (fragments = url.split('/'))
     */
    constructor(route: Route, node: RNodeRuntime, urlFragment: string);
    route: import("./Route.js").Route;
    node: import("../Instance/RNodeRuntime.js").RNodeRuntime;
    /** @type {RoutifyLoadReturn} */
    load: RoutifyLoadReturn;
    urlFragment: string;
    /** @type {Object.<string, string|string[]>} */
    _params: {
        [x: string]: string | string[];
    };
    get params(): {};
    setParams(params: any): void;
    getParamsFromFragment(): {};
}
