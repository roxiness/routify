import { getContext, tick } from 'svelte'
import { derived, get } from 'svelte/store'
import { route } from './store'

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
      meta.update()
      window.routify.appLoaded = true
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
  return function (path, strict = true) {
    path = url(path, null, strict)
    const currentPath = url(route.path, null, strict)
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
      if (matchingRoute) path = matchingRoute.shortPath
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


export function focus(element) {
  focus.elements = focus.elements || []
  // Tell the first element to wait for all synchronous elements before calling waitAndFocus
  if (!focus.elements.length)
    setTimeout(waitAndFocus)
  focus.elements.push(element)
}

function waitAndFocus() {
  const elementsByProximityToRoot = focus.elements.sort((a, b) => getAncestors(a) - getAncestors(b))
  const element = elementsByProximityToRoot[0]

  element.setAttribute('tabindex', 0)
  element.focus()
  focus.elements = []
}

function getAncestors(elem) {
  return document.evaluate('ancestor::*', elem, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength
}


const _meta = {
  props: {},
  templates: {},
  services: {
    plain: { propField: 'name', valueField: 'content' },
    twitter: { propField: 'name', valueField: 'content' },
    og: { propField: 'property', valueField: 'content' },
  },
  plugins: [
    {
      name: 'applyTemplate',
      condition: () => true,
      action: (prop, value) => {
        const template = _meta.getLongest(_meta.templates, prop) || (x => x)
        return [prop, template(value)]
      }
    },
    {
      name: 'createMeta',
      condition: () => true,
      action(prop, value) {
        _meta.writeMeta(prop, value)
      }
    },
    {
      name: 'createOG',
      condition: prop => !prop.match(':'),
      action(prop, value) {
        _meta.writeMeta(`og:${prop}`, value)
      }
    },
    {
      name: 'createTitle',
      condition: prop => prop === 'title',
      action(prop, value) {
        document.title = value;
      }
    }
  ],
  getLongest(repo, name) {
    const providers = repo[name]
    if (providers) {
      const currentPath = get(route).path
      const allPaths = Object.keys(repo[name])
      const matchingPaths = allPaths.filter(path => currentPath.includes(path))

      const longestKey = matchingPaths.sort((a, b) => b.length - a.length)[0]

      return providers[longestKey]
    }
  },
  writeMeta(prop, value) {
    const head = document.getElementsByTagName('head')[0]
    const match = prop.match(/(.+)\:/)
    const serviceName = match && match[1] || 'plain'
    const { propField, valueField } = meta.services[serviceName] || meta.services.plain
    const oldElement = document.querySelector(`meta[${propField}='${prop}']`)
    if (oldElement) oldElement.remove()

    const newElement = document.createElement('meta')
    newElement.setAttribute(propField, prop)
    newElement.setAttribute(valueField, value)
    newElement.setAttribute('data-origin', 'routify')
    head.appendChild(newElement)
  },
  set(prop, value) {
    _meta.plugins.forEach(plugin => {
      if (plugin.condition(prop, value))
        [prop, value] = plugin.action(prop, value) || [prop, value]
    })
  },
  clear() {
    const oldElement = document.querySelector(`meta`)
    if (oldElement) oldElement.remove()
  },
  template(name, fn) {
    const origin = _meta.getOrigin()
    _meta.templates[name] = _meta.templates[name] || {}
    _meta.templates[name][origin] = fn
  },
  update() {
    Object.keys(_meta.props).forEach((prop) => {
      let value = (_meta.getLongest(_meta.props, prop))
      _meta.plugins.forEach(plugin => {
        if (plugin.condition(prop, value)) {
          [prop, value] = plugin.action(prop, value) || [prop, value]

        }
      })
    })
  },
  batchedUpdate() {
    if (!_meta._pendingUpdate) {
      _meta._pendingUpdate = true
      setTimeout(() => {
        _meta._pendingUpdate = false
        this.update()
      })
    }
  },
  _updateQueued: false,
  getOrigin() {
    const routifyCtx = getContext('routify')
    return routifyCtx && get(routifyCtx).path || '/'
  },
  _pendingUpdate: false
}

export const meta = new Proxy(_meta, {
  set(target, name, value, receiver) {
    const { props, getOrigin } = target

    if (Reflect.has(target, name))
      Reflect.set(target, name, value, receiver)
    else {
      props[name] = props[name] || {}
      props[name][getOrigin()] = value
    }
    
    if (window.routify.appLoaded)
      target.batchedUpdate()
    return true
  }
})
