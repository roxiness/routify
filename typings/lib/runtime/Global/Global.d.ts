export class Global {
    /** @type {RoutifyRuntime[]} */
    instances: RoutifyRuntime[];
    log: any;
    /** @type {Router[]} */
    get routers(): import("../index.js").RouterClass[];
    browserAdapter: {
        toRouter: (url: string, router: import("../index.js").RouterClass) => string;
        toBrowser: (routers: import("../index.js").RouterClass[]) => string;
    };
    /** @param {string} name router name */
    urlFromBrowser: (name: string) => string;
    register(instance: any): Global;
}
export const globalInstance: Global;
