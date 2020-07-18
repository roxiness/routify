const MATCH_PARAM = RegExp(/\:([^/()]+)/g)

export function handleScroll (element) {
  if (navigator.userAgent.includes('jsdom')) return false
  scrollAncestorsToTop(element)
  handleHash()
}

export function handleHash () {
  if (navigator.userAgent.includes('jsdom')) return false
  const { hash } = window.location
  if (hash) {
    const validElementIdRegex = /^[A-Za-z]+[\w\-\:\.]*$/
    if (validElementIdRegex.test(hash.substring(1))) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView()
    }
  }
}

export function scrollAncestorsToTop (element) {
  if (
    element &&
    element.scrollTo &&
    element.dataset.routify !== 'scroll-lock' &&
    element.dataset['routify-scroll'] !== 'lock'
  ) {
    element.style['scroll-behavior'] = 'auto'
    element.scrollTo({ top: 0, behavior: 'auto' })
    element.style['scroll-behavior'] = ''
    scrollAncestorsToTop(element.parentElement)
  }
}

export const pathToRegex = (str, recursive) => {
  const suffix = recursive ? '' : '/?$' //fallbacks should match recursively
  str = str.replace(/\/_fallback?$/, '(/|$)')
  str = str.replace(/\/index$/, '(/index)?') //index files should be matched even if not present in url
  str = str.replace(MATCH_PARAM, '([^/]+)') + suffix
  return str
}

export const pathToParamKeys = string => {
  const paramsKeys = []
  let matches
  while ((matches = MATCH_PARAM.exec(string))) paramsKeys.push(matches[1])
  return paramsKeys
}

export const pathToRank = ({ path }) => {
  return path
    .split('/')
    .filter(Boolean)
    .map(str => (str === '_fallback' ? 'A' : str.startsWith(':') ? 'B' : 'C'))
    .join('')
}

let warningSuppressed = false

/* eslint no-console: 0 */
export function suppressWarnings () {
  if (warningSuppressed) return
  const consoleWarn = console.warn
  console.warn = function (msg, ...msgs) {
    const ignores = [
      "was created with unknown prop 'scoped'",
      "was created with unknown prop 'scopedSync'",
    ]
    if (!ignores.find(iMsg => msg.includes(iMsg)))
      return consoleWarn(msg, ...msgs)
  }
  warningSuppressed = true
}

export function currentLocation () {
  const pathMatch = window.location.search.match(/__routify_path=([^&]+)/)
  const prefetchMatch = window.location.search.match(/__routify_prefetch=\d+/)
  window.routify = window.routify || {}
  window.routify.prefetched = prefetchMatch ? true : false
  const path = pathMatch && pathMatch[1].replace(/[#?].+/, '') // strip any thing after ? and #
  return path || window.location.pathname
}
