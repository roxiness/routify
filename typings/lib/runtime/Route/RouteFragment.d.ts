export class RouteFragment {
    /**
     * @param {Route} route the route this fragment belongs to
     * @param {RNodeRuntime} node the node that corresponds to the fragment
     * @param {String=} urlFragment a fragment of the url (fragments = url.split('/'))
     * @param {Object<string, any>=} params
     */
    constructor(route: Route, node: RNodeRuntime, urlFragment?: string | undefined, params?: {
        [x: string]: any;
    } | undefined);
    route: import("./Route.js").Route;
    node: import("../Instance/RNodeRuntime.js").RNodeRuntime;
    /** @type {Partial<RoutifyLoadReturn>} */
    load: Partial<RoutifyLoadReturn>;
    urlFragment: string;
    params: any;
    /** @type {DeferredPromise<RenderContext>} */
    renderContext: DeferredPromise<RenderContext>;
}
