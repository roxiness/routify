import '#root/typedef.js'

// todo should these extend a base class?

export class InternalReflector {
    /** @param {Router} router */
    constructor(router) {
        this.router = router
        this.log = this.router.log
    }

    install() {}
    uninstall() {}
    reflect() {}
}
