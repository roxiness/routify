export class AppInstance {
    /** @type {RoutifyRuntime[]} */
    instances: RoutifyRuntime[];
    log: import("consolite").ConsoliteLogger<import("consolite").ExtendConsole, Console & {
        [x: string]: Function;
    }>;
    /** @type {Router[]} */
    get routers(): Router[];
    /** @type {import('../helpers/preload.js').RoutesMap} */
    routeMaps: import("../helpers/preload.js").RoutesMap;
    browserAdapter: BrowserAdapter;
    reset(): void;
    /** @param {Router} router */
    urlFromBrowser: (router: Router) => string;
    register(instance: any): this;
}
export const appInstance: AppInstance;
