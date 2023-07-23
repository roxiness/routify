export class AppInstance {
    /** @type {RoutifyRuntime[]} */
    instances: RoutifyRuntime[];
    log: import("consolite").ConsoliteLogger<import("consolite").ExtendConsole, Console & {
        [x: string]: Function;
    }>;
    /** @type {Router[]} */
    get routers(): import("../index.js").RouterClass[];
    /** @type {import('../helpers/preload.js').RoutesMap} */
    routeMaps: import('../helpers/preload.js').RoutesMap;
    browserAdapter: BrowserAdapter;
    /** @param {Router} router */
    urlFromBrowser: (router: Router) => string;
    register(instance: any): AppInstance;
}
export const appInstance: AppInstance;
