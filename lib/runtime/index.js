// @ts-ignore
import Router from './Router/Router.svelte'
import { createRouter, Router as RouterClass } from './Router/Router.js'
import { RoutifyRuntime } from './Instance/RoutifyRuntime.js'

import { globalInstance } from './Global/Global.js'
import { AddressReflector } from './Router/urlReflectors/Address.js'
import { LocalStorageReflector } from './Router/urlReflectors/LocalStorage.js'
import { InternalReflector } from './Router/urlReflectors/Internal.js'

export const Routify = RoutifyRuntime

export {
    createRouter,
    Router,
    RouterClass,
    globalInstance,
    AddressReflector,
    LocalStorageReflector,
    InternalReflector,
}

export * from './helpers/index.js'
export * from '../common/helpers.js'
