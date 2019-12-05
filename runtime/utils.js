import { getContext } from 'svelte'
import { get } from 'svelte/store'
import { route } from './store'
// import { routes } from '../tmp/routes'

export const url = (path, params) => {

    if (path.match(/^\.\.?\//)) {
        //RELATIVE PATH
        // get component's dir
        let dir = getContext('routify').component.path.replace(/[^\/]+$/, '')

        // traverse through parents if needed
        const traverse = path.match(/\.\.\//g)
        if (traverse)
            for (let i = 1; i <= traverse.length; i++) {
                dir = dir.replace(/[^\/]+\/$/, '')
            }

        // strip leading periods and slashes
        path = path.replace(/^[\.\/]+/, '')
        path = dir + path
    } else if (path.match(/^\//)) {
        // ABSOLUTE PATH
    } else {
        // NAMED PATH        
        let newPath = routes.filter(r => r.name === path)[0]
        if (!newPath) console.error(`a path named '${path}' does not exist`)
        else
            path = newPath.url.replace(/\/index$/, '')
    }

    params = Object.assign({}, get(route).params, params)
    for (let [key, value] of Object.entries(params)) {
        path = path.replace(`:${key}`, value)
    }
    return path
}