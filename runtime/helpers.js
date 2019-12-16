import { getContext } from 'svelte'
import { get, derived, writable } from 'svelte/store'
import { route } from './store'

export const params = derived(route, route => route.params )

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

export function _goto(context) {
    const urlFn = _url(context)
    return function goto(path, params) {
        history.pushState({}, null, urlFn(path, params))
    }
}

export function _url(context) {
    return function url(path, params) {

        if (path.match(/^\.\.?\//)) {
            //RELATIVE PATH
            // get component's dir
            // let dir = context.path.replace(/[^\/]+$/, '')
            let dir = context.path
            // traverse through parents if needed
            const traverse = path.match(/\.\.\//g)
            if (traverse)
                for (let i = 1; i <= traverse.length; i++) {
                    dir = dir.replace(/\/[^\/]+$/, '')
                }

            // strip leading periods and slashes
            path = path.replace(/^[\.\/]+/, '')
            path = dir + path
        } else if (path.match(/^\//)) {
            // ABSOLUTE PATH
        }

        params = Object.assign({}, context.params, params)
        for (const [key, value] of Object.entries(params)) {
            path = path.replace(`:${key}`, value)
        }
        return path
    }
}