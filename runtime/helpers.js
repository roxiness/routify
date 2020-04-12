import { getContext, tick } from 'svelte'
import { derived, get } from 'svelte/store'
import { route, routes, location } from './store'
import { pathToParams } from './utils'
import config from '../runtime.config'
import '../typedef'

/** @returns {import('svelte/store').Readable<{component: ClientNode}>} */
function getRoutifyContext() {
  return getContext('routify')
}

/** @type {import('svelte/store').Readable<ClientNodeApi>} */
export const layout = {
  subscribe(run) {
    const ctx = getRoutifyContext()
    return derived(ctx, ctx => ctx.component.api).subscribe(run)
  }
}

/** @type {import('svelte/store').Readable<ClientNodeApi>} */
export const page = {
  subscribe(run) {
    return derived(route, route => route.api).subscribe(run)
  }
}

/** @type {import('svelte/store').Readable<{component: ClientNode}>} */
export const context = {
  subscribe(run) {
    return getRoutifyContext().subscribe(run)
  },
}


/**@type {import('svelte/store').Readable<function():void>} */
export const ready = {
  subscribe(run) {
    window['routify'].stopAutoReady = true
    async function ready() {
      await tick()
      metatags.update()
      window['routify'].appLoaded = true
      dispatchEvent(new CustomEvent('app-loaded'))
    }
    run(ready)
    return () => { }
  }
}

/** 
 * @callback BeforeUrlChangeHelper
 * @param {function} callback
 * 
 * @type {import('svelte/store').Readable<BeforeUrlChangeHelper> & {_hooks:Array<function>}} */
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
 * Otherwise the context is updated before the component is destroyed. * 
 * @type {import('svelte/store').Readable<Object.<string, *>>} 
 **/
export const params = {
  subscribe(listener) {
    return derived(
      route,
      route => route.params
    ).subscribe(listener)
  },
}

/** @type {import('svelte/store').Readable<string>} */
export const leftover = {
  subscribe(listener) {
    return derived(
      route,
      route => route.leftover
    ).subscribe(listener)
  },
}

/** @type {import('svelte/store').Readable<Meta>} */
export const meta = {
  subscribe(listener) {
    const ctx = getRoutifyContext()
    return derived(ctx, ctx => ctx.component.meta).subscribe(listener)
  },
}

/** @type {import('svelte/store').Readable<UrlHelper>} */
export const url = {
  subscribe(listener) {
    const ctx = getRoutifyContext()
    return derived(
      [ctx, route, routes, location],
      args => makeUrlHelper(...args)
    ).subscribe(
      listener
    )
  }
}

/**
 * @callback UrlHelper
 * @param {String=} path
 * @param {UrlParams=} params
 * @param {UrlOptions=} options
 * @return {String}
 *
 * @param {{component: ClientNode}} $ctx 
 * @param {RouteNode} $oldRoute 
 * @param {RouteNode[]} $routes 
 * @param {{base: string, path: string}} $location
 * @returns {UrlHelper}
 */
export function makeUrlHelper($ctx, $oldRoute, $routes, $location) {
  return function url(path, params, options = {}) {
    const { component } = $ctx
    path = path || './'

    const strict = options && options.strict !== false
    if (!strict) path = path.replace(/index$/, '')

    if (path.match(/^\.\.?\//)) {
      //RELATIVE PATH
      let [, breadcrumbs, relativePath] = path.match(/^([\.\/]+)(.*)/)
      let dir = component.path
      const traverse = breadcrumbs.match(/\.\.\//g) || []
      traverse.forEach(() => dir = dir.replace(/\/[^\/]+\/?$/, ''))
      path = `${dir}/${relativePath}`.replace(/\/$/, '')

    } else if (path.match(/^\//)) {
      // ABSOLUTE PATH
    } else {
      // NAMED PATH
      const matchingRoute = $routes.find(route => route.meta.name === path)
      if (matchingRoute) path = matchingRoute.shortPath
    }

    /** @type {Object<string, *>} Parameters */
    const allParams = Object.assign({}, $oldRoute.params, component.params, params)
    let pathWithParams = path
    for (const [key, value] of Object.entries(allParams)) {
      pathWithParams = pathWithParams.replace(`:${key}`, value)
    }

    const fullPath = $location.base + pathWithParams + _getQueryString(path, params)
    return fullPath.replace(/\?$/, '')
  }
}

/**
 * 
 * @param {string} path 
 * @param {object} params 
 */
function _getQueryString(path, params) {
  if (!config.queryHandler) return ""
  const pathParamKeys = pathToParams(path)
  const queryParams = {}
  if (params) Object.entries(params).forEach(([key, value]) => {
    if (!pathParamKeys.includes(key))
      queryParams[key] = value
  })
  return config.queryHandler.stringify(queryParams)
}

/**
* @callback GotoHelper
* @param {String=} path
* @param {UrlParams=} params
* @param {GotoOptions=} options
*
* @type {import('svelte/store').Readable<GotoHelper>} */
export const goto = {
  subscribe(listener) {
    return derived(url,
      url => function goto(path, params, _static, shallow) {
        const href = url(path, params)
        if (!_static) history.pushState({}, null, href)
        else getContext('routifyupdatepage')(href, shallow)
      }
    ).subscribe(
      listener
    )
  },
}

/** @type {import('svelte/store').Readable<GotoHelper>} */
export const redirect = {
  subscribe(listener) {
    return derived(url,
      url => function redirect(path, params, _static, shallow) {
        const href = url(path, params)
        if (!_static) history.replaceState({}, null, href)
        else getContext('routifyupdatepage')(href, shallow)
      }
    ).subscribe(
      listener
    )
  },
}

/**
 * @callback IsActiveHelper
 * @param {String=} path
 * @param {UrlParams=} params
 * @param {UrlOptions=} options
 * @returns {Boolean}
 * 
 * @type {import('svelte/store').Readable<IsActiveHelper>} */
export const isActive = {
  subscribe(run) {
    return derived(
      [url, route],
      ([url, route]) => function isActive(path = "", params = {}, { strict } = { strict: true }) {
        path = url(path, null, { strict })
        const currentPath = url(route.path, null, { strict })
        const re = new RegExp('^' + path)
        return !!currentPath.match(re)
      }
    ).subscribe(run)
  },
}

/**
 * @param {ClientNodeApi} nodeApi1 
 * @param {ClientNodeApi} nodeApi2 
 * @returns [ClientNodeApi, ClientNodeApi, ClientNodeApi]
 */
export function getConcestor(nodeApi1, nodeApi2) {
  const node1 = nodeApi1.__file
  const node2 = nodeApi2.__file

  // The route is the last piece of layout
  const lineage1 = [...node1.lineage, node1]
  const lineage2 = [...node2.lineage, node2]

  let concestor = lineage1[0] //root
  let children = [lineage1[0], lineage2[0]]
  // iterate through the layouts starting from the root
  lineage1.forEach((n1, i) => {
    const n2 = lineage2[i]
    if (n2 && n1.parent === n2.parent) {
      concestor = n1.parent
      children = [n1, n2]
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

/**
 * Sets element to active
 * @param {HTMLElement} element  
 */
export function focus(element) {
  if (!focusIsSet) {
    focusIsSet = true
    element.setAttribute('tabindex', "0")
    element.focus()
    setTimeout(() => (focusIsSet = false))
  }
}
let focusIsSet = false



const _metatags = {
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
        const template = _metatags.getLongest(_metatags.templates, prop) || (x => x)
        return [prop, template(value)]
      }
    },
    {
      name: 'createMeta',
      condition: () => true,
      action(prop, value) {
        _metatags.writeMeta(prop, value)
      }
    },
    {
      name: 'createOG',
      condition: prop => !prop.match(':'),
      action(prop, value) {
        _metatags.writeMeta(`og:${prop}`, value)
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
    const { propField, valueField } = metatags.services[serviceName] || metatags.services.plain
    const oldElement = document.querySelector(`meta[${propField}='${prop}']`)
    if (oldElement) oldElement.remove()

    const newElement = document.createElement('meta')
    newElement.setAttribute(propField, prop)
    newElement.setAttribute(valueField, value)
    newElement.setAttribute('data-origin', 'routify')
    head.appendChild(newElement)
  },
  set(prop, value) {
    _metatags.plugins.forEach(plugin => {
      if (plugin.condition(prop, value))
        [prop, value] = plugin.action(prop, value) || [prop, value]
    })
  },
  clear() {
    const oldElement = document.querySelector(`meta`)
    if (oldElement) oldElement.remove()
  },
  template(name, fn) {
    const origin = _metatags.getOrigin()
    _metatags.templates[name] = _metatags.templates[name] || {}
    _metatags.templates[name][origin] = fn
  },
  update() {
    Object.keys(_metatags.props).forEach((prop) => {
      let value = (_metatags.getLongest(_metatags.props, prop))
      _metatags.plugins.forEach(plugin => {
        if (plugin.condition(prop, value)) {
          [prop, value] = plugin.action(prop, value) || [prop, value]

        }
      })
    })
  },
  batchedUpdate() {
    if (!_metatags._pendingUpdate) {
      _metatags._pendingUpdate = true
      setTimeout(() => {
        _metatags._pendingUpdate = false
        this.update()
      })
    }
  },
  _updateQueued: false,
  getOrigin() {
    const routifyCtx = getRoutifyContext()
    return routifyCtx && get(routifyCtx).path || '/'
  },
  _pendingUpdate: false
}


/**
 * metatags
 * @prop {Object.<string, string>}
 */
export const metatags = new Proxy(_metatags, {
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