import * as stores from './store'
import { get } from 'svelte/store'
import { beforeUrlChange } from './helpers'
import { urlToRoute } from './utils/urlToRoute'
import { currentLocation } from './utils'

export function init(routes, callback) {
  /** @type { ClientNode | false } */
  let lastRoute = false

  function updatePage(proxyToUrl, shallow) {
    const url = proxyToUrl || currentLocation()
    const route = urlToRoute(url, routes)
    const currentRoute = shallow && urlToRoute(currentLocation(), routes)
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
  for (const hook of beforeUrlChange._hooks.filter(Boolean)) {
    // return false if the hook returns false
    const result = await hook(event, route) //todo remove route from hook. Its API Can be accessed as $page
    if (!result) return false
  }
  return true
}

