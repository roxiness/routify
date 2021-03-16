import * as stores from './store'
import { get } from 'svelte/store'
import { beforeUrlChange } from './helpers'
import { urlToRoute } from './utils/urlToRoute'
import { currentLocation } from './utils'

export function init(routes, callback) {
  /** @type { ClientNode | false } */
  let lastRoute = false

  function updatePage(proxyToUrl, shallow) {
    const url = proxyToUrl || currentLocation().fullpath
    const route = urlToRoute(url)
    if (route.redirectTo) {
      history.replaceStateNative({}, null, route.redirectTo)
      delete route.redirectTo
    }

    const currentRoute = shallow && urlToRoute(currentLocation().fullpath, routes)
    const contextRoute = currentRoute || route
    const nodes = [...contextRoute.layouts, route]
    if (lastRoute) delete lastRoute.last //todo is a page component the right place for the previous route?
    route.last = lastRoute
    lastRoute = route

    //set the route in the store
    if (!proxyToUrl)
      stores.urlRoute.set(route)
    stores.route.set(route)

    //preload components in parallel
    route.api.preload().then(() => {
      //run callback in Router.svelte    
      stores.isChangingPage.set(true)
      callback(nodes)
    })
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
    if (!history[eventName + 'Native'])
      history[eventName + 'Native'] = history[eventName]
    history[eventName] = async function (state = {}, title, url) {
      // do nothing if we're navigating to the current page
      const currentUrl = location.pathname + location.search + location.hash
      if (url === currentUrl) return false

      const { id, path, params } = get(stores.route)
      state = { id, path, params, ...state }
      const event = new Event(eventName.toLowerCase())
      Object.assign(event, { state, title, url })

      const route = await runHooksBeforeUrlChange(event, url)
      if (route) {
        history[eventName + 'Native'].apply(this, [state, title, url])
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
        if (await runHooksBeforeUrlChange(event, currentLocation().fullpath)) {
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
  const href = el && el.href

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

  const url = new URL(href)
  const relativeUrl = url.pathname + url.search + url.hash

  event.preventDefault()
  history.pushState({}, '', relativeUrl)
}

async function runHooksBeforeUrlChange(event, url) {
  const route = urlToRoute(url).api
  for (const hook of beforeUrlChange._hooks.filter(Boolean)) {
    // return false if the hook returns false
    const result = await hook(event, route, { url })
    if (!result) return false
  }
  return true
}

