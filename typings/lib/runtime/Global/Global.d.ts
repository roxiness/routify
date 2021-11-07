export class Global {
    /** @type {RoutifyRuntime[]} */
    instances: RoutifyRuntime[];
    log: import("../../../node_modules/consolite/typings/index.js").ConsoliteLogger;
    /** @type {Router[]} */
    get routers(): import("../index.js").RouterClass[];
    browserAdapter: BrowserAdapter;
    /** @param {Router} router */
    urlFromBrowser: (router: Router) => string;
    register(instance: any): Global;
}
export const globalInstance: Global;
