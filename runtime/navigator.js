import { route as routeStore } from './store'
import { get } from 'svelte/store'
import { beforeUrlChange } from './helpers'
const { _hooks } = beforeUrlChange

export function init(routes, callback) {
  let prevRoute = false

  function updatePage(url, shallow) {
    const currentUrl = window.location.pathname
    url = url || currentUrl

    const route = urlToRoute(url, routes)
    const currentRoute = shallow && urlToRoute(currentUrl, routes)
    const contextRoute = currentRoute || route
    const layouts = [...contextRoute.layouts, route]
    delete prevRoute.prev
    route.prev = prevRoute
    prevRoute = route

    //set the route in the store
    routeStore.set(route)

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
    history[eventName] = async function (state, title, url) {
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
  const route = get(routeStore)
  for (const hook of _hooks.filter(Boolean)) {
    // return false if the hook returns false
    if (await !hook(event, route)) return false
  }
  return true
}

function urlToRoute(url, routes) {
  const mockUrl = new URL(location).searchParams.get('__mock-url')
  url = mockUrl || url

  const route = routes.find(route => url.match(route.regex))
  if (!route)
    throw new Error(
      `Route could not be found. Make sure ${url}.svelte or ${url}/index.svelte exists. A restart may be required.`
    )

  if (route.paramKeys) {
    const layouts = layoutByPos(route.layouts)
    const fragments = url.split('/').filter(Boolean)
    const routeProps = getRouteProps(route.path)

    routeProps.forEach((prop, i) => {
      if (prop) {
        route.params[prop] = fragments[i]
        if (layouts[i]) layouts[i].param = { [prop]: fragments[i] }
        else route.param = { [prop]: fragments[i] }
      }
    })
  }

  route.leftover = url.replace(new RegExp(route.regex), '')

  return route
}

function layoutByPos(layouts) {
  const arr = []
  layouts.forEach(layout => {
    arr[layout.path.split('/').filter(Boolean).length - 1] = layout
  })
  return arr
}

function getRouteProps(url) {
  return url
    .split('/')
    .filter(Boolean)
    .map(f => f.match(/\:(.+)/))
    .map(f => f && f[1])
}
