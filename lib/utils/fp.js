const identity = x => x

const noop = () => {}

const nope = () => false

const mapAsync = (mapper, array) => {
  const fn = _array => Promise.all(_array.map(mapper))
  if (array) return fn(array)
  return fn
}

const filter = predicate => array => array.filter(predicate)

const filterAsync = (mapper, array) =>
  Promise.all(
    array.map(async (item, ...args) => ({
      item,
      keep: await mapper(item, ...args),
    }))
  ).then(results => results.filter(({ keep }) => keep).map(({ item }) => item))

const someAsync = async (postulate, array) => {
  let i = 0
  for (const item of array) {
    if (await postulate(item, i++, array)) {
      return true
    }
  }
  return false
}

const pipe = (...fns) => initial => fns.reduce((x, f) => f(x), initial)

async function pipeAsync (...fns) {
  let x = {}
  for (const f of fns) {
    await f(x) 
  }
  return x
}

/**
 * NOTE Debug util
 *
 * Logs the current value in the pipeline.
 */
const _log = x => {
  // eslint-disable-next-line no-console
  console.log(require('util').inspect(x, { depth: 999, colors: true }))
  return x
}

/**
 * NOTE Debug util
 *
 * Logs the current value in the pipeline and exit the process.
 */
const _dump = x => {
  // eslint-disable-next-line no-console
  console.log(require('util').inspect(x, { depth: 999, colors: true }))
  process.exit()
}


/**
 * walkAsync = (...walkers: file => {}) => (tree => tree)
 *
 * Special tree walker for the scanner, with plugin support in mind.
 *
 *       cosnt tree = await walkAsync(
 *         file => !file.isDir, // false returns exclude the file
 *         condition && walkerX, // falsy values are ignored
 *         ...
 *       )(inputTree)
 *
 * - each "walker" will be called with each file in the tree (except if some
 *   file are excluded before they reac this walker)
 *
 * - multiple walkers can be specified: they will all be run sequentially on
 *   each file (except if one returns `false`, thereby excluding the file and
 *   stopping processing)
 *
 * - the return value of the walkers is ignored, except for `false`; the walkers
 *   must mutate the file object they are passed for side effects
 *
 * - walkers can be async
 *
 * - falsy values (instead of expected function) are filtered out of the
 *   walkers array
 *
 * - if a walker returns `false`, then the file whill be filtered out
 *
 * - all the files in a dir are processed in parallel
 *
 * - the child dir of a file is always processed after the parent file
 */
function walkAsync(...walkerGroups) {
  const walkers = [].concat(...walkerGroups).filter(Boolean)

  if (walkers.length < 1) return identity

  function _walk(parent) {
    return filterAsync(async item => {
      const excluded = await someAsync(async walker => {
        const result = await walker(item, parent)
        return result === false
      }, walkers)
      if (excluded) return false
      if (item.dir && item.dir.length > 0) {
        item.dir = await _walk(item)
      }
      return true
    }, parent.dir)
  }

  async function walkTree(tree) {
    tree.dir = await _walk(tree)
    return tree
  }

  return walkTree
}

module.exports = {
  _dump,
  _log,
  walkAsync,
  filter,
  filterAsync,
  identity,
  mapAsync,
  noop,
  nope,
  pipe,
  pipeAsync,
  someAsync,
}
