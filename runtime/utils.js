const MATCH_PARAM = RegExp(/\:([^/()]+)/g)

export function handleScroll(element) {
  if (navigator.userAgent.includes('jsdom')) return false
  scrollAncestorsToTop(element)
  handleHash()
}

export function handleHash() {
  if (navigator.userAgent.includes('jsdom')) return false
  const { hash } = window.location
  if (hash) {
    const el = document.querySelector(hash)
    if (hash && el) el.scrollIntoView()
  }
}

export function scrollAncestorsToTop(element) {
  if (
    element &&
    element.scrollTo &&
    element.dataset.routify !== 'scroll-lock'
  ) {
    element.style['scroll-behavior'] = "auto"
    element.scrollTo({ top: 0, behavior: 'auto' })
    element.style['scroll-behavior'] = ""
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

export const pathToParams = string => {
  const params = []
  let matches
  while (matches = MATCH_PARAM.exec(string))
    params.push(matches[1])
  return params
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
export function suppressWarnings() {
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
