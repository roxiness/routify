import { BaseReflector } from './ReflectorBase.js'

export class LocalStorageReflector extends BaseReflector {
    /** @param {Router} router */
    constructor(router) {
        super(router)
        this.storageName = `__routify-router-${this.router.name}`
    }
    reflect() {
        window.localStorage.setItem(this.storageName, this.router.url.internal())
    }
}
