import * as stores from './store'
import { get } from 'svelte/store'
import { beforeUrlChange } from './helpers'
import config from '../runtime.config'
const { _hooks } = beforeUrlChange

export function init(routes, callback) {
  /** @type { ClientNode | false } */
  let lastRoute = false

  function updatePage(proxyToUrl, shallow) {
    const currentUrl = window.location.pathname
    const url = proxyToUrl || currentUrl

    const route = urlToRoute(url, routes)
    const currentRoute = shallow && urlToRoute(currentUrl, routes)
    const contextRoute = currentRoute || route
    const layouts = [...contextRoute.layouts, route]
    if (lastRoute) delete lastRoute.last //todo is a page component the right place for the previous route?
    route.last = lastRoute
    lastRoute = route

    //set the route in the store
    if (!proxyToUrl)
      stores.urlRoute.set(route)
    stores.route.set(route)

    //run callback in Router.svelte
    callback(layouts)
  }

  const destroy = createEventListeners(updatePage)

  return { updatePage, destroy }
}

/**
 * svelte:window events doesn't work on refresh
 * @param {Function} updatePage
 */
function createEventListeners(updatePage) {
  // history.*state
  ;['pushState', 'replaceState'].forEach(eventName => {
    const fn = history[eventName]
    history[eventName] = async function (state = {}, title, url) {
      const { id, path, params } = get(stores.route)
      state = { id, path, params, ...state }
      const event = new Event(eventName.toLowerCase())
      Object.assign(event, { state, title, url })

      if (await runHooksBeforeUrlChange(event)) {
        fn.apply(this, [state, title, url])
        return dispatchEvent(event)
      }
    }
  })

  let _ignoreNextPop = false

  const listeners = {
    click: handleClick,
    pushstate: () => updatePage(),
    replacestate: () => updatePage(),
    popstate: async event => {
      if (_ignoreNextPop)
        _ignoreNextPop = false
      else {
        if (await runHooksBeforeUrlChange(event)) {
          updatePage()
        } else {
          _ignoreNextPop = true
          event.preventDefault()
          history.go(1)
        }
      }
    },
  }

  Object.entries(listeners).forEach(args => addEventListener(...args))

  const unregister = () => {
    Object.entries(listeners).forEach(args => removeEventListener(...args))
  }

  return unregister
}

function handleClick(event) {
  const el = event.target.closest('a')
  const href = el && el.getAttribute('href')

  if (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.shiftKey ||
    event.button ||
    event.defaultPrevented
  )
    return
  if (!href || el.target || el.host !== location.host) return

  event.preventDefault()
  history.pushState({}, '', href)
}

async function runHooksBeforeUrlChange(event) {
  const route = get(stores.route)
  for (const hook of _hooks.filter(Boolean)) {
    // return false if the hook returns false
    if (await !hook(event, route)) return false //todo remove route from hook. Its API Can be accessed as $page
  }
  return true
}

function urlToRoute(url, routes) {
  const basepath = get(stores.basepath)
  const route = routes.find(route => url.match(`^${basepath}${route.regex}`))
  if (!route)
    throw new Error(
      `Route could not be found. Make sure ${url}.svelte or ${url}/index.svelte exists. A restart may be required.`
    )

  const [, base, path] = url.match(`^(${get(stores.basepath)})(${route.regex})`)
  if (config.queryHandler)
    route.params = config.queryHandler.parse(window.location.search)

  if (route.paramKeys) {
    const layouts = layoutByPos(route.layouts)
    const fragments = path.split('/').filter(Boolean)
    const routeProps = getRouteProps(route.path)

    routeProps.forEach((prop, i) => {
      if (prop) {
        route.params[prop] = fragments[i]
        if (layouts[i]) layouts[i].param = { [prop]: fragments[i] }
        else route.param = { [prop]: fragments[i] }
      }
    })
  }

  route.leftover = url.replace(new RegExp(base + route.regex), '')

  return route
}

/**
 *
 * @param {array} layouts
 */
function layoutByPos(layouts) {
  const arr = []
  layouts.forEach(layout => {
    arr[layout.path.split('/').filter(Boolean).length - 1] = layout
  })
  return arr
}

/**
 *
 * @param {string} url
 */
function getRouteProps(url) {
  return url
    .split('/')
    .filter(Boolean)
    .map(f => f.match(/\:(.+)/))
    .map(f => f && f[1])
}
