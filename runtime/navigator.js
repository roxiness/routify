import * as store from './store'

export default function (routes, cb) {


    // create events for pushState and replaceState
    ;['pushState', 'replaceState'].forEach(eventName => {
      const fn = history[eventName]
      history[eventName] = function (state, title, url) {
        const event = Object.assign(
          new Event(eventName.toLowerCase(), { state, title, url })
        )
        Object.assign(event, { state, title, url })

        fn.apply(this, [state, title, url])
        return dispatchEvent(event)
      }
    })

  function updatePage(url, shallow) {
    const currentUrl = window.location.pathname
    url = url || currentUrl

    let route = urlToRoute(url, routes)
    let currentRoute = shallow && urlToRoute(currentUrl, routes)
    let contextRoute = currentRoute || route
    const layouts = [...contextRoute.layouts, route]

    //set the route in the store
    store.route.set(route)

    //run callback in Router.svelte
    cb({ layouts, route })
  }

  function click(event) {
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

  return {updatePage, click}
}


function urlToRoute(url, routes) {
  const fallbacks = routes.filter(route => route.isFallback)
  routes = routes.filter(route => !route.isFallback)
  console.log(url)
  const urlWithIndex = url.match(/\/index\/?$/)
    ? url
    : (url + '/index').replace(/\/+/g, '/') //remove duplicate slashes
  const urlWithSlash = (url + '/').replace(/\/+/g, '/')

  const route =
    routes.filter(route => urlWithIndex.match(route.regex))[0] ||
    routes.filter(route => url.match(route.regex))[0] ||
    fallbacks.filter(route => urlWithSlash.match(route.regex))[0] ||
    fallbacks.filter(route => url.match(route.regex))[0]

  if (!route)
    throw new Error(
      `Route could not be found. Make sure ${url}.svelte or ${url}/index.svelte exists. A restart may be required.`
    )

  const regexUrl = route.regex.match(/\/index$/) ? urlWithIndex : url

  const params = {}
  if (route.paramKeys) {
    regexUrl.match(route.regex).forEach((match, i) => {
      if (i === 0) return
      const key = route.paramKeys[i - 1]
      params[key] = match
    })
  }

  route.params = params

  const match = url.match(route.regex + '(.+)')
  route.leftover = (match && match[1]) || ''

  return route
}