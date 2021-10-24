export class BaseReflector {
    /** @param {Router} router */
    constructor(router: Router);
    router: import("../Router").Router;
    log: any;
    install(): void;
    uninstall(): void;
    reflect(): void;
}
