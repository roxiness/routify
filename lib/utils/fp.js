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

async function pipeAsync (...mws) {
  let x = {}
  for (const mw of mws) {
    await mw.middleware(x) 
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



module.exports = {
  _dump,
  _log,
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
