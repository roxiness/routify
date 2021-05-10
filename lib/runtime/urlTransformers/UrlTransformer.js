export const base = {
    toInternal: x => x,
    toExternal: x => x,
}

export const sharedAddress = {
    toInternal: router => {
        const { pathname, search, hash } = window.location
        const url = pathname + search + hash
        const re = new RegExp(`#${router.name}:(.+)`)
        const matches = url.match(re)
        if (matches) {
            const returnUrl = matches[1].replace(/#\w+:.+/, '')
            return returnUrl
        } else return url
    },
    toExternal: (url, { routers }) => {},
}
