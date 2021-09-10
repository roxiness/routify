export class RouteFragment {
    /**
     * @param {Route} route the route this fragment belongs to
     * @param {RNodeRuntime} node the node that corresponds to the fragment
     * @param {String} urlFragment a fragment of the url (fragments = url.split('/'))
     */
    constructor(route: Route, node: RNodeRuntime, urlFragment: string);
    route: import("./Route").Route;
    node: import("../Instance/RNodeRuntime").RNodeRuntime;
    load: any;
    urlFragment: string;
    get params(): {
        [x: string]: string | string[];
    };
    setParams(params: any): void;
    getParamsFromFragment(): {};
    #private;
}
