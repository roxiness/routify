const { makeLegalIdentifier } = require('rollup-pluginutils')
const MATCH_BRACKETS = RegExp(/\[[^\[\]]+\]/g)

module.exports = function compiler(files) {
  return files
    .map(route => {
      route.path = stripExtension(route.filepath)
      route.component = makeLegalIdentifier(route.path)
      if (!route.isLayout) {
        route.layouts = route.layouts.map(layout => {
          layout.component = makeLegalIdentifier(
            stripExtension(layout.filepath)
          )
          return layout
        })
        route.paramKeys = getParams(route.path)
        route.regex = getRegex(route.path, route.isFallback)
        route.name = route.path
          .match(/[^\/]*\/[^\/]+$/)[0]
          .replace(/[^\w\/]/g, '') //last dir and name, then replace all but \w and /
        route.ranking = route.path
          .split('/')
          .map(str => (str.match(/\[|\]/) ? 'A' : 'Z'))
          .join('')
        route.url = route.path.replace(/\[([^\]]+)\]/, ':$1')
      }
      return route
    })
    .sort((curr, prev) => (curr.path.length > prev.path.length ? -1 : 1))
    .sort((c, p) => (c.ranking >= p.ranking ? -1 : 1))
}

function stripExtension(str) {
  return str.replace(/\.[^\.]+$/, '')
}

function getParams(string) {
  const matches = string.match(MATCH_BRACKETS)
  if (matches) return matches.map(str => str.substr(1, str.length - 2))
}

function getRegex(str, isFallback) {
  const suffix = isFallback ? '' : '\/?$' //fallbacks should match recursively
  str = str.replace(/\/_fallback?$/, '/')
  str = str.replace(/\/index$/, '(/index)?') //index files should be matched even if not present in url
  str = '^' + str.replace(MATCH_BRACKETS, '([^/]+)') + suffix
  return str
}
