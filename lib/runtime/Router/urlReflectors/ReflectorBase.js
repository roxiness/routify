export class BaseReflector {
    /** @param {Router} router */
    constructor(router, options) {
        this.router = router
        this.log = this.router.log
    }
    install() {}
    uninstall() {}
    reflect() {}
}
