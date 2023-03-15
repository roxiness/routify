import { BaseReflector } from './ReflectorBase.js'

// todo should these extend a base class?

export class InternalReflector extends BaseReflector {
    install() {
        this.router.url.replace('/')
    }
}
