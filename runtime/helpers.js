import {getContext, tick} from 'svelte'
import {derived, get, writable} from 'svelte/store'
import {route, routes, rootContext, isChangingPage} from './store'
import {resolveUrl} from './utils'
import {onPageLoaded} from './utils/onPageLoaded.js'
import {urlToRoute} from './utils/urlToRoute'
import {prefetch as _prefetch} from './Prefetcher.svelte'
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
  return getContext('routify') || rootContext
}

export const nodes = {
  subscribe(run) {
    const nodes = []
    return derived(routes, routes => {
      routes.forEach(route => {
        const layouts = route.layouts
          .map(layout => layout.api)
          .filter(api => !nodes.includes(api))
        nodes.push(route.api, ...layouts)
      })

      // enhance find method
      const find = nodes.find
      nodes.find = (value, ...args) => {
        // if value is string, return route which name or path matches value
        if (typeof value === 'string')
          return nodes.find(n => n.meta.name === value) ||
            nodes.find(n => n.path === value)
        // or default to Array.find
        else return find.bind(nodes)(value, ...args)
      }

      return nodes
    }).subscribe(run)
  }
}

export const components = nodes

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
export const node = {
  subscribe(run) {
    const ctx = getRoutifyContext()
    return derived(ctx, ctx => ctx.component.api).subscribe(run)
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
      await onPageLoaded({page: get(route), metatags, afterPageLoad})
    }
    run(ready)
    return () => {}
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
  _hooks: [
    event => isChangingPage.set(false)
  ],
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
  listener(callback => {hooks[index] = callback})
  return (...params) => {
    delete hooks[index]
    listener(...params)
  }
}

/**
 * We have to grab params and leftover from the context and not directly from the store.
 * Otherwise the context is updated before the component is destroyed. * 
 * @typedef {Object.<string, *>} ParamsHelper
 * @typedef {import('svelte/store').Readable<ParamsHelper>} ParamsHelperStore
 * @type {ParamsHelperStore}
 **/
export const params = {
  subscribe(run) {
    const ctx = getRoutifyContext()
    return derived(ctx, ctx => ctx.route.params).subscribe(run)
  }
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

/** * 
 * @param {ClientNodeApi} descendant 
 * @param {ClientNodeApi} ancestor 
 * @param {boolean} treatIndexAsAncestor 
 */
export function isAncestor(ancestor, descendant, treatIndexAsAncestor = true) {
  ancestor = ancestor.__file || ancestor
  descendant = descendant.__file || descendant
  const siblings = descendant.parent === ancestor.parent

  if (!ancestor.isIndex) return false
  if (descendant.shortPath === ancestor.shortPath) return false

  if (siblings && !descendant.isDir) return !!treatIndexAsAncestor
  return descendant.shortPath.startsWith(ancestor.shortPath)
}


/**
 * @typedef {import('svelte/store').Readable<Meta>} MetaHelperStore 
 * @type {MetaHelperStore}
 * */
export const meta = {
  subscribe(listener) {
    const ctx = getRoutifyContext()
    return derived(ctx, ctx => ctx.layout.meta).subscribe(listener)
  },
}

/**
 * @typedef {{
 *   (el: Node): {update: (args: any) => void;}
 *   (path?: string | undefined, params?: UrlParams | undefined, options?: UrlOptions | undefined): string;
 * }} UrlHelper
 * @typedef {import('svelte/store').Readable<UrlHelper>} UrlHelperStore
 * @type {UrlHelperStore} 
 * */
export const url = {
  subscribe(listener) {
    const ctx = getRoutifyContext()
    return derived(
      ctx,
      ctx => makeUrlHelper(ctx, ctx.route, ctx.routes)
    ).subscribe(
      listener
    )
  }
}

/** 
 * @param {{component: ClientNode}} $ctx 
 * @param {RouteNode} $currentRoute 
 * @param {RouteNode[]} $routes 
 * @returns {UrlHelper}
 */
export function makeUrlHelper($ctx, $currentRoute, $routes) {
  return function url(path, params = {}, options) {
    const {component} = $ctx
    const inheritedParams = Object.assign({}, $currentRoute.params, component.params)
    let el = path && path.nodeType && path

    if (el)
      path = path.getAttribute('href')

    path = path ? resolvePath(path) : component.shortPath

    // preload the route  
    const route = $routes.find(route => [route.shortPath || '/', route.path].includes(path))
    if (route && route.meta.preload === 'proximity' && window.requestIdleCallback) {
      const delay = routify.appLoaded ? 0 : 1500
      setTimeout(() => {
        window.requestIdleCallback(() => route.api.preload())
      }, delay)
    }

    const strict = options && options.strict !== false
    if (!strict) path = path.replace(/index$/, '')

    let url = resolveUrl(path, params, inheritedParams)

    if (el) {
      el.href = url
      return {
        update(changedParams) {el.href = resolveUrl(path, changedParams, inheritedParams)}
      }
    }

    return url

    /**
     * converts relative, named and absolute paths to absolute paths
     * example: at `/foo/bar/baz`  the path  `../bar2/:something`  converts to   `/foo/bar2/:something`
     * @param {*} path 
     */
    function resolvePath(path) {
      if (path.match(/^\.\.?\//)) {
        //RELATIVE PATH
        let [, breadcrumbs, relativePath] = path.match(/^([\.\/]+)(.*)/)
        let dir = component.path.replace(/\/$/, '')
        const traverse = breadcrumbs.match(/\.\.\//g) || []
        // if this is a page, we want to traverse one step back to its folder
        if (component.isPage) traverse.push(null)
        traverse.forEach(() => dir = dir.replace(/\/[^\/]+\/?$/, ''))
        path = `${dir}/${relativePath}`.replace(/\/$/, '')
        path = path || '/' // empty means root
      } else if (path.match(/^\//)) {
        // ABSOLUTE PATH
      } else {
        // NAMED PATH
        const matchingRoute = $routes.find(route => route.meta.name === path)
        if (matchingRoute) path = matchingRoute.shortPath
      }
      return path
    }



  }
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
    const routifyUpdatePage = getContext('routifyupdatepage')
    return derived(url,
      url => function goto(path, params, _static, shallow) {
        const href = url(path, params)
        if (!_static) history.pushState({}, null, href)
        else routifyUpdatePage(href, shallow)
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
    const routifyUpdatePage = getContext('routifyupdatepage')
    return derived(url,
      url => function redirect(path, params, _static, shallow) {
        const href = url(path, params)
        if (!_static) history.replaceState({}, null, href)
        else routifyUpdatePage(href, shallow)
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
      ([url, route]) => function isActive(path = "", params = {}, {strict} = {strict: true}) {
        path = url(path, params, {strict})
        const currentPath = url(route.path, params, {strict})
        const re = new RegExp('^' + path + '($|/)')
        return !!currentPath.match(re)
      }
    ).subscribe(run)
  },
}

/**
 * @param {string|ClientNodeApi} path 
 * @param {*} options 
 */
export function precache(path, options) {
  const node = typeof path === 'string' ? urlToRoute(path) : path
  node.component()
}

/**
 * @param {string|ClientNodeApi} path 
 * @param {*} options 
 */
export function prefetch(path, options) {
  _prefetch(path, options)
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
  subscribe(listener) {
    this._origin = this.getOrigin()
    return listener(metatags)
  },
  props: {},
  templates: {},
  services: {
    plain: {propField: 'name', valueField: 'content'},
    twitter: {propField: 'name', valueField: 'content'},
    og: {propField: 'property', valueField: 'content'},
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
    const {propField, valueField} = metatags.services[serviceName] || metatags.services.plain
    const oldElement = document.querySelector(`meta[${propField}='${prop}']`)
    if (oldElement) oldElement.remove()

    const newElement = document.createElement('meta')
    newElement.setAttribute(propField, prop)
    newElement.setAttribute(valueField, value)
    newElement.setAttribute('data-origin', 'routify')
    head.appendChild(newElement)
  },
  set(prop, value) {
    // we only want strings. If metatags is used as a store, svelte will try to assign an object to prop
    if (typeof prop === 'string') {
      _metatags.plugins.forEach(plugin => {
        if (plugin.condition(prop, value))
          [prop, value] = plugin.action(prop, value) || [prop, value]
      })
    }
  },
  clear() {
    const oldElement = document.querySelector(`meta`)
    if (oldElement) oldElement.remove()
  },
  template(name, fn) {
    const origin = _metatags.getOrigin
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
  _origin: false,
  getOrigin() {
    if (this._origin) return this._origin
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
    const {props} = target

    if (Reflect.has(target, name))
      Reflect.set(target, name, value, receiver)
    else {
      props[name] = props[name] || {}
      props[name][target.getOrigin()] = value
    }

    if (window['routify'].appLoaded)
      target.batchedUpdate()
    return true
  }
})