module.exports = function template(routes, { pages, dynamicImports, unknownPropWarnings }) {
    const imports = dynamicImports ? [] : routes
    const lines = imports.map(
        route => `import ${route.component} from '${pages.replace(/\\/g, '/') + route.filepath}'`
    )

    lines.push(
        `\n\n export const routes = [`,
        routes
            .filter(r => r.name) //layouts don't have names
            .map(({ filepath, isLayout, component, layouts, ...route }) => ({
                ...route,
                component:
                    dynamicImports
                        ? `() => import('${pages}${filepath}').then(m => m.default)`
                        : `() => ${component}`,
                layouts: layouts.map(n =>
                    dynamicImports
                        ? `() => import('${pages}${routes.filter(r => r.component === n)[0].filepath}').then(m => m.default)`
                        : `() => ${n}`
                )
            }))
            .map(f => partialStringify(f, ['component', 'layouts']))
            .join(`,\n`),
        ']'
    )

    routes.forEach(route => delete route.filepath)
    routes.forEach(route => delete route.isLayout)

    const content = lines.join("\n")

    return `
    ${content}

    export const options = ${JSON.stringify({ unknownPropWarnings })}
    `
}


function partialStringify(obj, ignoreList) {
    ignoreList.forEach(key => {
        let prop = obj[key]
        if (Array.isArray(prop))
            prop = prop.map(p => p = `'''${p}'''`)
        else
            prop = `'''${prop}'''`

        obj[key] = prop
    })
    return JSON.stringify(obj, 0, 2).replace(/"'''|'''"/g, '')
}
