import config from '../tmp/config'
const MATCH_PARAM = RegExp(/\:[^\/\()]+/g)

export function handleScroll(element) {
  scrollAncestorsToTop(element)
  handleHash()
}


export function handleHash() {
  const { scroll } = config
  const options = ['auto', 'smooth', 'smooth']
  const { hash } = window.location
  if (scroll && hash) {
    const behavior = options.includes(scroll) && scroll || 'auto'    
    const el = document.querySelector(hash)
    if (hash && el) el.scrollIntoView({ behavior })
  }
}


export function scrollAncestorsToTop(element) {
  if (element && element.dataset.routify !== 'scroll-lock') {
    element.scrollTo(0, 0)
    scrollAncestorsToTop(element.parentElement)
  }
}

export const pathToRegex = (str, recursive) => {
  const suffix = recursive ? '' : '/?$' //fallbacks should match recursively
  str = str.replace(/\/_fallback?$/, '(/|$)')
  str = str.replace(/\/index$/, '(/index)?') //index files should be matched even if not present in url
  str = '^' + str.replace(MATCH_PARAM, '([^/]+)') + suffix
  return str
}

export const pathToParams = string => {
  const matches = string.match(MATCH_PARAM)
  if (matches) return matches.map(str => str.substr(1, str.length - 2))
}

export const pathToRank = ({ path, isFallback }) => {
  return !isFallback
    ? 'Z'
    : path
        .split('/')
        .map(str => (str.match(/\[|\]/) ? 'A' : 'B'))
        .join('')
}
