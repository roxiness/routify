import { getContext } from 'svelte'
import { derived } from 'svelte/store'


export const context = {
  subscribe(listener) {
    return getContext('routify').subscribe(listener)
  },
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

export function _isActive(context, route) {
  const url = _url(context, route)
  return function (path, keepIndex = true) {
    path = url(path, null, keepIndex)
    const currentPath = url(route.path, null, keepIndex)
    const re = new RegExp('^' + path)
    return currentPath.match(re)
  }
}

export function _goto(context, route) {
  const url = _url(context, route)
  return function goto(path, params, _static, shallow) {
    const href = url(path, params)
    if (!_static) history.pushState({}, null, href)
    else getContext('routifyupdatepage')(href, shallow)
  }
}

export function _url(context, route) {
  return function url(path, params, preserveIndex) {
    path = path || './'

    if (!preserveIndex) path = path.replace(/index$/, '')

    if (path.match(/^\.\.?\//)) {
      //RELATIVE PATH
      // get component's dir
      // let dir = context.path.replace(/[^\/]+$/, '')
      let dir = context.path
      // traverse through parents if needed
      const traverse = path.match(/\.\.\//g) || []
      traverse.forEach(() => { dir = dir.replace(/\/[^\/]+\/?$/, '') })


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
