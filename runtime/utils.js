const MATCH_BRACKETS = RegExp(/\[[^\[\]]+\]/g)

export const scrollAncestorsToTop = function(element) {
  if (element && element.dataset.routify !== 'scroll-lock') {
    element.scrollTo(0, 0)
    scrollAncestorsToTop(element.parentElement)
  }
}

export const pathToRegex = (str, recursive) => {
  const suffix = recursive ? '' : '/?$' //fallbacks should match recursively
  str = str.replace(/\/_fallback?$/, '(/|$)')
  str = str.replace(/\/index$/, '(/index)?') //index files should be matched even if not present in url
  str = '^' + str.replace(MATCH_BRACKETS, '([^/]+)') + suffix
  return str
}

export const pathToParams = string => {
  const matches = string.match(MATCH_BRACKETS)
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
