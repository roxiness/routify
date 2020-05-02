import { getContext, tick } from 'svelte'
import { derived, get } from 'svelte/store'
import { route, routes, location } from './store'
import { pathToParams } from './utils'
import config from '../runtime.config'
/// <reference path="../typedef.js" />

/** @ts-check */
/**
 * @typedef {Object} RoutifyContext
 * @prop {ClientNode} component
 * @prop {ClientNode} layout
 * @prop {any} componentFile 
 * 
 *  @returns {import('svelte/store').Readable<RoutifyContext>} */
function getRoutifyContext() {
  return getContext('routify')
}


/**
 * @typedef {import('svelte/store').Readable<ClientNodeApi>} ClientNodeHelperStore
 * @type { ClientNodeHelperStore } 
 */
export const page = {
  subscribe(run) {
    return derived(route, route => route.api).subscribe(run)
  }
}

/** @type {ClientNodeHelperStore} */
export const layout = {
  subscribe(run) {
    const ctx = getRoutifyContext()
    return derived(ctx, ctx => ctx.layout.api).subscribe(run)
  }
}

/**
* @typedef {{component: ClientNode}}  ContextHelper
* @typedef {import('svelte/store').Readable<ContextHelper>} ContextHelperStore
* @type {ContextHelperStore}
*/
export const context = {
  subscribe(run) {
    return getRoutifyContext().subscribe(run)
  }
}

/**
 * @typedef {function():void} ReadyHelper
 * @typedef {import('svelte/store').Readable<ReadyHelper>} ReadyHelperStore
 * @type {ReadyHelperStore}
*/
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
 * @callback AfterPageLoadHelper
 * @param {function} callback
 * 
 * @typedef {import('svelte/store').Readable<AfterPageLoadHelper> & {_hooks:Array<function>}} AfterPageLoadHelperStore
 * @type {AfterPageLoadHelperStore}
 */
export const afterPageLoad = {
  _hooks: [],
  subscribe: hookHandler
}

/** 
 * @callback BeforeUrlChangeHelper
 * @param {function} callback
 *
 * @typedef {import('svelte/store').Readable<BeforeUrlChangeHelper> & {_hooks:Array<function>}} BeforeUrlChangeHelperStore
 * @type {BeforeUrlChangeHelperStore}
 **/
export const beforeUrlChange = {
  _hooks: [],
  subscribe: hookHandler
}

function hookHandler(listener) {
  const hooks = this._hooks
  const index = hooks.length
  listener(callback => { hooks[index] = callback })
  return () => delete hooks[index]
}

/**
 * We have to grab params and leftover from the context and not directly from the store.
 * Otherwise the context is updated before the component is destroyed. * 
 * @typedef {Object.<string, *>} ParamsHelper
 * @typedef {import('svelte/store').Readable<ParamsHelper>} ParamsHelperStore
 * @type {ParamsHelperStore}
 **/
export const params = {
  subscribe(listener) {
    return derived(
      route,
      route => route.params
    ).subscribe(listener)
  },
}

/**
 * @typedef {string} LeftoverHelper
 * @typedef {import('svelte/store').Readable<string>} LeftoverHelperStore
 * @type {LeftoverHelperStore} 
 **/
export const leftover = {
  subscribe(listener) {
    return derived(
      route,
      route => route.leftover
    ).subscribe(listener)
  },
}




/**
 * @typedef {import('svelte/store').Readable<Meta>} MetaHelperStore 
 * @type {MetaHelperStore}
 * */
export const meta = {
  subscribe(listener) {
    const ctx = getRoutifyContext()
    return derived(ctx, ctx => ctx.component.meta).subscribe(listener)
  },
}

/**
 * @callback UrlHelper
 * @param {String=} path
 * @param {UrlParams=} params
 * @param {UrlOptions=} options
 * @return {String}
 *
 * @typedef {import('svelte/store').Readable<UrlHelper>} UrlHelperStore
 * @type {UrlHelperStore} 
 * */
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
 * @param {{component: ClientNode}} $ctx 
 * @param {RouteNode} $oldRoute 
 * @param {RouteNode[]} $routes 
 * @param {{base: string, path: string}} $location
 * @returns {UrlHelper}
 */
export function makeUrlHelper($ctx, $oldRoute, $routes, $location) {
  return function url(path, params, options) {
    const { component } = $ctx
    path = path || './'

    const strict = options && options.strict !== false
    if (!strict) path = path.replace(/index$/, '')

    if (path.match(/^\.\.?\//)) {
      //RELATIVE PATH
      let [, breadcrumbs, relativePath] = path.match(/^([\.\/]+)(.*)/)
      let dir = component.path.replace(/\/$/, '')
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
* @typedef {import('svelte/store').Readable<GotoHelper>}  GotoHelperStore
* @type {GotoHelperStore} 
* */
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

/**
 * @type {GotoHelperStore} 
 * */
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
 * @typedef {import('svelte/store').Readable<IsActiveHelper>} IsActiveHelperStore
 * @type {IsActiveHelperStore} 
 * */
export const isActive = {
  subscribe(run) {
    return derived(
      [url, route],
      ([url, route]) => function isActive(path = "", params = {}, { strict } = { strict: true }) {
        path = url(path, null, { strict })
        const currentPath = url(route.path, null, { strict })
        const re = new RegExp('^' + path + '($|/)')
        return !!currentPath.match(re)
      }
    ).subscribe(run)
  },
}

/**
 * @typedef {[ClientNodeApi, ClientNodeApi, ClientNodeApi]} ConcestorReturn
 * @typedef {function(ClientNodeApi, ClientNodeApi):ConcestorReturn} GetConcestor
 * @type {GetConcestor}
 */
export function getConcestor(nodeApi1, nodeApi2) {
  const node1 = nodeApi1.__file
  const node2 = nodeApi2.__file

  // The route is the last piece of layout
  const lineage1 = [...node1.lineage, node1]
  const lineage2 = [...node2.lineage, node2]

  let concestor = lineage1[0] //root
  let children = [lineage1[0].api, lineage2[0].api]
  // iterate through the layouts starting from the root
  lineage1.forEach((n1, i) => {
    const n2 = lineage2[i]
    if (n2 && n1.parent === n2.parent) {
      concestor = n1.parent
      children = [n1.api, n2.api]
    }
  })
  return [concestor.api, children[0], children[1]]
}

/**
 * Get index difference between two paths
 *
 * @export
 * @param {array} paths
 * @param {object} newPath
 * @param {object} oldPath
 * @returns {number}
 */
export function getDirection(paths, newPath, oldPath) {
  const newIndex = paths.findIndex(path => newPath.path.startsWith(path))
  const oldIndex = paths.findIndex(path => oldPath.path.startsWith(path))
  return newIndex - oldIndex
}

/**
 * Sets element to active
 * @typedef {function(HTMLElement):void} FocusHelper
 * @type {FocusHelper}
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

    if (window['routify'].appLoaded)
      target.batchedUpdate()
    return true
  }
})