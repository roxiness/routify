export class AppInstance {
    /** @type {RoutifyRuntime[]} */
    instances: RoutifyRuntime[];
    log: import("consolite").ConsoliteLogger;
    /** @type {Router[]} */
    get routers(): import("../index.js").RouterClass[];
    browserAdapter: BrowserAdapter;
    /** @param {Router} router */
    urlFromBrowser: (router: Router) => string;
    register(instance: any): AppInstance;
}
export const appInstance: AppInstance;
