import '#root/typedef.js'

export class LocalStorageReflector {
    /** @param {Router} router */
    constructor(router) {
        this.router = router
        this.log = this.router.log
        this.storageName = `__routify-router-${this.router.name}`
    }

    install() {}
    uninstall() {}
    reflect() {
        window.localStorage.setItem(this.storageName, this.router.url)
    }
}
