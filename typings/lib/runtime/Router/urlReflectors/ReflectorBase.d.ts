export class BaseReflector {
    /** @param {Router} router */
    constructor(router: Router);
    router: import("../Router").Router;
    log: import("consola").Consola;
    install(): void;
    uninstall(): void;
    /** @param {Route} route */
    reflect(route: Route): void;
}
