import { getContext } from 'svelte'
import { get } from 'svelte/store'
import { route } from './runtime/store'

export const url = (path, params) => {
    if(path)
        return _url(path, params)
    else {
        
        return _url.bind({context : getContext('routify')})
    }
}

function _url(path, params) {
    if (path.match(/^\.\.?\//)) {
        //RELATIVE PATH
        // get component's dir
        const context = (this && this.context) || getContext('routify')
        if (!context) throw new Error('url helper can only handle relative paths during component instantiation')
        let dir = context.component.path.replace(/[^\/]+$/, '')

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