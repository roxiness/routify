import '#root/typedef.js'

// todo should these extend a base class?

export class InternalReflector {
    /** @param {Router} router */
    constructor(router) {
        this.router = router
        this.log = this.router.log
    }

    install() {
        console.log('')
        this.log.debug(
            `initialize router "${this.router.name}" with url from address`,
        )
    }
    uninstall() {}
    reflect() {}
}
