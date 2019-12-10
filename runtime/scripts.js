export const suppressWarnings = (function() {
  const _ignoreList = []
  let initialized = false
  // eslint-disable-next-line no-console
  const _warn = console.warn

  return function(newIgnores = []) {
    newIgnores.forEach(key => {
      if (!_ignoreList.includes(key)) _ignoreList.push(key)
    })

    if (!initialized) {
      initialized = true
      // eslint-disable-next-line no-console
      console.warn = function(...params) {
        const msg = params[0]
        const match = _ignoreList.filter(prop =>
          msg.match(new RegExp(`was created with unknown prop '${prop}'`))
        ).length
        if (!match) _warn(...params)
      }
    }
  }
})()

export const demandObject = function(obj) {
  const isObj = Object.prototype.toString.call(obj) === '[object Object]'
  if (isObj || !obj) return true
  else
    throw new Error(`"${obj}" is not an object. "scoped" prop must an object`)
}
