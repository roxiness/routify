export { default as Router } from './Router.svelte';
export { default as Route } from './Route.svelte';
export { route } from './store'

export const href = (path, params) => {
    for (let [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, value)
    }
    return path
}