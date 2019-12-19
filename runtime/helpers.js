import { getContext } from 'svelte'
import { get, derived, writable } from 'svelte/store'
import { route } from './store'

export const params = derived(route, route => route.params)

export const context = {
    subscribe(listener) {
        return getContext('routify').subscribe(listener)
    }
}

export const leftover = {
    subscribe(listener) {
        return derived(getContext('routify'),
            context => context.leftover
        ).subscribe(listener)
    }
}

export const url = {
    subscribe(listener) {
        return derived(getContext('routify'),
            context => context.url
        ).subscribe(listener)
    }
}

export const goto = {
    subscribe(listener) {
        return derived(getContext('routify'),
            context => context.goto
        ).subscribe(listener)
    }
}

export const isActive = {
    subscribe(listener) {
        return derived(getContext('routify'),
            context => context.isActive
        ).subscribe(listener)
    }
}

export function _isActive(context, route){
    const url = _url(context, route)
    return function (path, keepIndex = true) {
        path = url(path, null, keepIndex)
        const currentPath = url(route.url, null, keepIndex)
        return currentPath.includes(path)
    }
}

export function _goto(context, route) {
    const url = _url(context, route)
    return function goto(path, params) {
        history.pushState({}, null, url(path, params))
    }
}

export function _url(context, route) {
    return function url(path, params, preserveIndex) {

        if (!preserveIndex)
            path = path.replace(/index$/, '')

        if (path.match(/^\.\.?\//)) {
            //RELATIVE PATH
            // get component's dir
            // let dir = context.path.replace(/[^\/]+$/, '')
            let dir = context.path
            // traverse through parents if needed
            const traverse = path.match(/\.\.\//g)
            if (traverse)
                for (let i = 1; i <= traverse.length; i++) {
                    dir = dir.replace(/\/[^\/]+\/?$/, '')
                }

            // strip leading periods and slashes
            path = path.replace(/^[\.\/]+/, '')
            dir = dir.replace(/\/$/, '') + '/'
            path = dir + path
        } else if (path.match(/^\//)) {
            // ABSOLUTE PATH
        }

        params = Object.assign({}, route.params, context.params, params)
        for (const [key, value] of Object.entries(params)) {
            path = path.replace(`:${key}`, value)
        }
        return path
    }
}