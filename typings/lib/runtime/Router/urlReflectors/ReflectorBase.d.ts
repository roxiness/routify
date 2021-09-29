export class BaseReflector {
    /** @param {Router} router */
    constructor(router: Router);
    router: import("../Router").Router;
    log: any;
    install(): void;
    uninstall(): void;
    /** @param {Route} route */
    reflect(route: Route): void;
}
