function sanitizeOptions(defaultOptions, inputOptions) {
  const options = {}
  Object.keys(defaultOptions).forEach(key => {
    options[key] = key in inputOptions ? inputOptions[key] : defaultOptions[key]
  })
  return options
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const stripExtension = str => str.replace(/\.[^\.]+$/, '')

const MATCH_BRACKETS = RegExp(/\[[^\[\]]+\]/g)
const pathToRegex = (str, recursive) => {
  const suffix = recursive ? '' : '/?$' //fallbacks should match recursively
  str = str.replace(/\/_fallback?$/, '(/|$)')
  str = str.replace(/\/index$/, '(/index)?') //index files should be matched even if not present in url
  str = '^' + str.replace(MATCH_BRACKETS, '([^/]+)') + suffix
  return str
}

const pathToParams = string => {
  const matches = string.match(MATCH_BRACKETS)
  if (matches) return matches.map(str => str.substr(1, str.length - 2))
}

const pathToRank = ({ path }) => {
  return path
    .split('/')
    .filter(Boolean)
    .map(str => (str === '_fallback' ? 'A' : str.startsWith(':') ? 'B' : 'C'))
    .join('')
}

const serializeRoute = (route, keys) => {
  return keys.map(key => route[key])
}

module.exports = {
  sanitizeOptions,
  asyncForEach,
  stripExtension,
  pathToRegex,
  pathToParams,
  pathToRank,
  serializeRoute,
}
