

module.exports.suppressWarnings = function () {
    const _warn = console.warn
    console.warn = function (...params) {
        const msg = params[0]
        const ignores = ['scoped', 'route', 'routes', 'url']

        const match = ignores.filter(prop => msg.match(new RegExp(`was created with unknown prop '${prop}'`))).length
        if (!match)
            _warn(...params)
    }
}
