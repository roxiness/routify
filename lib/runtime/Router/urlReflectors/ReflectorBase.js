import '../../../../typedef.js'

export class BaseReflector {
    /** @param {Router} router */
    constructor(router) {
        this.router = router
        this.log = this.router.log
    }
    install() {}
    uninstall() {}
    /** @param {Route} route */
    reflect(route) {}
}
