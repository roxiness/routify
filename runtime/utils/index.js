import config from '../../runtime.config'

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
    const validElementIdRegex = /^[A-Za-z]+[\w\-\:\.]*$/
    if (validElementIdRegex.test(hash.substring(1))) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView()
    }
  }
}

export function scrollAncestorsToTop(element) {
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
  str = `^${str}`
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

/** Supresses Routify caused logs and warnings for one tick */
export function suppressComponentWarnings(ctx, tick) {
  suppressComponentWarnings._console = suppressComponentWarnings._console || { log: console.log, warn: console.warn }
  const { _console } = suppressComponentWarnings

  name = ctx.componentFile.name
    .replace(/Proxy<_?(.+)>/, '$1') //nollup wraps names in Proxy<...>
    .replace(/^Index$/, ctx.component.shortPath.split('/').pop()) //nollup names Index.svelte index. We want a real name
    .replace(/^./, s => s.toUpperCase()) //capitalize first letter
    .replace(/\:(.+)/, 'U5B$1u5D') // :id => U5Bidu5D

  const ignores = [
    `<${name}> received an unexpected slot "default".`,
    `<${name}> was created with unknown prop 'scoped'`,
    `<${name}> was created with unknown prop 'scopedSync'`,
  ]
  for (const log of ['log', 'warn']) {
    console[log] = (...args) => {
      if (!ignores.includes(args[0]))
        _console[log](...args)
    }
    tick().then(() => {
      //after component has been created, we want to restore the console method (log or warn)
      console[log] = _console[log]
    })
  }
}

export function currentLocation() {
  let { url, options } = getUrlAndOptions()
  if (config.useHash)
    url = url.replace(/.*#(.+)/, '$1')

  const { path, search, hash } = getUrlParts(url)
  return { url, path, search, hash, options }
}

/**
 * converts /__routify_[options]/path/to to
 * {options, url: '/path/to'}
 * @param {string} url 
 */
function getUrlAndOptions(url) {
  url = url || window.location.pathname + window.location.search + window.location.hash
  const [, , _options, _url] = url.match(/^(\/__routify_([^/]+))?(.*)/)
  const options = JSON.parse(decodeURIComponent(_options || '') || '{}')

  window.routify = window.routify || {}
  window.routify.prefetched = options.prefetch

  return { url: _url, options }
}

export function getUrlParts(url) {
  const [, path, search, hash] = url.match(/([^?#]*)([^#]*)(.*)/)
  return { path, search, hash }
}