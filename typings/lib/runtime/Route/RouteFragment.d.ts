export class RouteFragment {
    /**
     * @param {Route} route the route this fragment belongs to
     * @param {RNodeRuntime} node the node that corresponds to the fragment
     * @param {String} urlFragment a fragment of the url (fragments = url.split('/'))
     * @param {Object<string, any>} params
     */
    constructor(route: Route, node: RNodeRuntime, urlFragment: string, params: {
        [x: string]: any;
    });
    route: import("./Route.js").Route;
    node: import("../Instance/RNodeRuntime.js").RNodeRuntime;
    /** @type {Partial<RoutifyLoadReturn>} */
    load: Partial<RoutifyLoadReturn>;
    urlFragment: string;
    set params(arg: {});
    get params(): {};
    /** @type {import('svelte/store').Writable<RenderContext>} */
    renderContext: import('svelte/store').Writable<RenderContext>;
    /**
     * @type {Object.<string, string|string[]>}
     **/
    _params: {
        [x: string]: string | string[];
    };
    get index(): number;
}
