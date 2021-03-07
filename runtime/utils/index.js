import config from '../../runtime.config'

const MATCH_PARAM = RegExp(/\:([^/()]+)/g)

export function handleScroll(element, scrollToTop) {
  if (navigator.userAgent.includes('jsdom')) return false
  if (scrollToTop) scrollAncestorsToTop(element)
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

  const name = ctx.componentFile.name
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
  let dirtyFullpath = window.location.pathname + window.location.search + window.location.hash
  const { url, options } = resolvePrefetch(dirtyFullpath)
  const parsedUrl = parseUrl(url)

  return { ...parsedUrl, options }
}

/**
 * converts /path/to__routify_url_options__1234abcde to
 * {options, url: '/path/to'}
 * @param {string} dirtyFullpath 
 */
function resolvePrefetch(dirtyFullpath) {
  const [url, _options] = dirtyFullpath.split('__[[routify_url_options]]__')

  const options = JSON.parse(decodeURIComponent(_options || '') || '{}')

  window.routify = window.routify || {}
  window.routify.prefetched = options.prefetch

  return { url, options }
}

/**
 * 
 * @param {string} url 
 */
export function parseUrl(url) {
  if (config.useHash)
    url = url.replace(/.*#(.+)/, '$1')
  const origin = url.startsWith('/') ? window.location.origin : undefined
  const _url = new URL(url, origin)
  const fullpath = _url.pathname + _url.search + _url.hash
  return { url: _url, fullpath }
}


/**
 * populates parameters, applies urlTransform, prefixes hash
 * eg. /foo/:bar to /foo/something or #/foo/something
 * and applies config.urlTransform
 * @param {*} path 
 * @param {*} params 
 */
export function resolveUrl(path, params, inheritedParams) {
  const hash = config.useHash ? '#' : ''
  let url
  url = populateUrl(path, params, inheritedParams)
  url = config.urlTransform.apply(url)
  url = hash + url
  return url
}


/**
 * populates an url path with parameters
 * populateUrl('/home/:foo', {foo: 'something', bar:'baz'})  to /foo/something?bar=baz
 * @param {*} path 
 * @param {*} params 
 */
export function populateUrl(path, params, inheritedParams) {
  const allParams = Object.assign({}, inheritedParams, params)
  const queryString = getQueryString(path, params)

  for (const [key, value] of Object.entries(allParams))
    path = path.replace(`:${key}`, value)

  return `${path}${queryString}`
}


/**
 * 
 * @param {string} path 
 * @param {object} params 
 */
function getQueryString(path, params) {
  if (!config.queryHandler) return ""
  const ignoredKeys = pathToParamKeys(path)
  const queryParams = {}
  if (params) Object.entries(params).forEach(([key, value]) => {
    if (!ignoredKeys.includes(key))
      queryParams[key] = value
  })
  return config.queryHandler.stringify(queryParams).replace(/\?$/, '')
}