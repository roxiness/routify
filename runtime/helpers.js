import { getContext, tick } from 'svelte'
import { derived } from 'svelte/store'

export const context = {
  subscribe(listener) {
    return getContext('routify').subscribe(listener)
  },
}

export const ready = {
  subscribe(listener) {
    window.routify.stopAutoReady = true
    return listener(async () => {
      await tick()
      dispatchEvent(new CustomEvent('app-loaded'))
    })
  }
}


export const beforeUrlChange = {
  _hooks: [],
  subscribe(listener) {
    const hooks = this._hooks
    const index = hooks.length
    listener(callback => { hooks[index] = callback })
    return () => delete hooks[index]
  }
}

/**
 * We have to grab params and leftover from the context and not directly from the store.
 * Otherwise the context is updated before the component is destroyed.
 **/
export const params = {
  subscribe(listener) {
    return derived(
      getContext('routify'),
      context => context.route.params
    ).subscribe(listener)
  },
}

export const leftover = {
  subscribe(listener) {
    return derived(
      getContext('routify'),
      context => context.route.leftover
    ).subscribe(listener)
  },
}

/** HELPERS */
export const url = {
  subscribe(listener) {
    return derived(getContext('routify'), context => context.url).subscribe(
      listener
    )
  },
}

export const goto = {
  subscribe(listener) {
    return derived(getContext('routify'), context => context.goto).subscribe(
      listener
    )
  },
}

export const isActive = {
  subscribe(listener) {
    return derived(
      getContext('routify'),
      context => context.isActive
    ).subscribe(listener)
  },
}

export function _isActive(url, route) {
  return function (path, keepIndex = true) {
    path = url(path, null, keepIndex)
    const currentPath = url(route.path, null, keepIndex)
    const re = new RegExp('^' + path)
    return currentPath.match(re)
  }
}

export function _goto(url) {
  return function goto(path, params, _static, shallow) {
    const href = url(path, params)
    if (!_static) history.pushState({}, null, href)
    else getContext('routifyupdatepage')(href, shallow)
  }
}

export function _url(context, route, routes) {
  return function url(path, params, preserveIndex) {
    path = path || './'

    if (!preserveIndex) path = path.replace(/index$/, '')

    if (path.match(/^\.\.?\//)) {
      //RELATIVE PATH
      // get component's dir
      let dir = context.path
      // traverse through parents if needed
      const traverse = path.match(/\.\.\//g) || []
      traverse.forEach(() => {
        dir = dir.replace(/\/[^\/]+\/?$/, '')
      })

      // strip leading periods and slashes
      path = path.replace(/^[\.\/]+/, '')
      dir = dir.replace(/\/$/, '') + '/'
      path = dir + path
    } else if (path.match(/^\//)) {
      // ABSOLUTE PATH
    } else {
      // NAMED PATH
      const matchingRoute = routes.find(route => route.meta.name === path)
      if(matchingRoute) path = matchingRoute.shortPath
    }

    params = Object.assign({}, route.params, context.params, params)
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, value)
    }
    return path
  }
}


export function getConcestor(route1, route2) {
  // The route is the last piece of layout
  const layouts1 = [...route1.layouts, route1]
  const layouts2 = [...route2.layouts, route2]

  let concestor = false
  let children = [layouts1[0], layouts2[0]]

  // iterate through the layouts starting from the root
  layouts1.forEach((layout1, i) => {
    const layout2 = layouts2[i]
    if (layout1 === layout2) {
      concestor = layout1
      // if this is a concestor, the next iteration would be children
      children = [layouts1[i + 1], layouts2[i + 1]]
    }
  })
  return [concestor, ...children]
}



/**
 * Get index difference between two paths
 *
 * @export
 * @param {array} paths
 * @param {object} newPath
 * @param {object} oldPath
 * @returns In
 */
export function getDirection(paths, newPath, oldPath) {
  const newIndex = paths.findIndex(path => newPath.path.startsWith(path))
  const oldIndex = paths.findIndex(path => oldPath.path.startsWith(path))
  return newIndex - oldIndex
}

