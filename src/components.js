import { get } from 'svelte/store'
export { default as Router } from './Router.svelte';
export { default as Route } from './Route.svelte';
export { route } from './store'
import { route } from './store'


export const url = (path, params) => {

    if (!path.match(/^\//)) {
        path = get(route).url.replace(/\/index$/, '/') + path
    }
    params = Object.assign(get(route), params)
    for (let [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, value)
    }
    return path
}