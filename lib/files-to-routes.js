const { makeLegalIdentifier } = require('rollup-pluginutils')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const fsa = {
  readdir: promisify(fs.readdir),
  stat: promisify(fs.stat),
}

const MATCH_BRACKETS = RegExp(/\[[^\[\]]+\]/g);

module.exports = async function filesToRoutes({ pages, ignore, dynamicImports }) {
    ignore = Array.isArray(ignore) ? ignore : [ignore]
    const files = await getFiles(pages, ['html', 'svelte'], ignore)
    const routes = convertToRoutes(files)

    if (!routes.length) console.log('no routes found in ' + pages)

    return convertToCodeString(routes, pages, { dynamicImports })
}


function convertToCodeString(routes, pages, { dynamicImports }) {
    const imports = dynamicImports ? [] : routes
    const lines = imports.map(
        route => `import ${route.component} from '${pages}${route.filepath}'`
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

    return lines.join("\n")
}

async function getFiles(absoluteDir, extensions, ignore, _path = '', _nested = false, layouts = []) {
    const list = []
    const files = await fsa.readdir(absoluteDir)
    const sortedFiles = moveToFront(files, ['_layout.svelte', '_reset.svelte'])
    await asyncForEach(sortedFiles, async filename => {
        const ignoreFile = ignore.filter(ignoreStr => filename.match(ignoreStr)).length
        if (ignoreFile) return;


        const _filepath = path.resolve(absoluteDir + '/' + filename)
        const isDir = (await fsa.stat(_filepath)).isDirectory()
        const [noExtName, ext] = splitString(filename, '.')

        const isLayout = ['_layout', '_reset'].includes(noExtName)
        const isReset = ['_reset'].includes(noExtName)
        const isFallback = noExtName === '_fallback'
        const filepath = _path + '/' + filename

        if (!isLayout && !isFallback && filename.match(/^_/)) return //skip underscore prefixed files that aren't layout

        if (isReset) layouts = []

        if (isLayout) layouts.push(filepath)

        if (isDir) {
            const nestedList = await getFiles(_filepath, extensions, ignore, filepath, true, [...layouts])
            list.push(...nestedList)
        }

        if (extensions.includes(ext))
            list.push({ filepath, layouts, isLayout, isFallback })
    })
    return list
};

function convertToRoutes(files) {
    return files

        .map(route => {
            route.path = stripExtension(route.filepath)
            route.component = makeLegalIdentifier(route.path)
            if (!route.isLayout) {
                route.layouts = route.layouts.map(layout => makeLegalIdentifier(stripExtension(layout)))
                route.paramKeys = getParams(route.path)
                route.regex = getRegex(route.path)
                route.name = route.path.match(/[^\/]*\/[^\/]+$/)[0].replace(/[^\w\/]/g, '') //last dir and name, then replace all but \w and /
                route.ranking = route.path.split('/').map(str => str.match(/\[|\]/) ? 'A' : 'Z').join('')
                route.url = route.path.replace(/\[([^\]]+)\]/, ':$1')
            }
            return route
        })
        .sort((curr, prev) => curr.path.length > prev.path.length ? -1 : 1)
        .sort((c, p) => c.ranking >= p.ranking ? -1 : 1)

}



async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


function splitString(str, delimiter) {
    const pos = str.lastIndexOf(delimiter)
    if (pos === -1)
        return [str, null]
    return [
        str.substr(0, pos),
        str.substr(pos + 1)
    ]

}

function moveToFront(array, names) {
    const sortedArray = []
    names.forEach(name => {
        const pos = array.indexOf(name)
        if (pos !== -1)
            sortedArray.push(array.splice(pos, 1)[0])
    })
    sortedArray.push(...array)
    return sortedArray
}

function getRegex(str) {
    str = str.replace(/\/_fallback_?$/, '/')
    str = '^' + str.replace(MATCH_BRACKETS, '([^/]+)')
    return str
}

function getParams(string) {
    const matches = string.match(MATCH_BRACKETS)
    if (matches)
        return matches.map(str => str.substr(1, str.length - 2))

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

function alphanumeric(str, replace = '_') {
    return str.replace(/[^\w]+/g, replace)
}

function stripExtension(str) {
    return str.replace(/\.[^\.]+$/, '')
}

function stripBrackets(str) {
    return str.replace(/[\[\]]+/g, '')
}
