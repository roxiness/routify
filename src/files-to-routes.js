const { makeLegalIdentifier } = require('rollup-pluginutils')
const path = require('path')
const fs = require('fs')

const MATCH_BRACKETS = RegExp(/\[[^\[\]]+\]/g);

module.exports = async function filesToRoutes({ pages, ignore }) {
    ignore = Array.isArray(ignore) ? ignore : [ignore]
    const files = await getFiles(pages, ['html', 'svelte'], ignore)
    const routes = _filesToRoutes(files)

    if (!routes.length) console.log('no routes found in ' + pages)

    return convertToCodeString(routes)
}


function convertToCodeString(routes) {
    let lines = routes.map(route => `import ${route.component} from './src/pages${route.filepath}'`)

    routes.forEach(route => delete route.filepath)
    routes.forEach(route => delete route.isLayout)

    lines.push(
        `\n\n export const routes = [`,
        routes
        .filter(r => r.name) //layouts don't have names
        .map(f => partialStringify(f, ['component', 'layouts']))
        .join(`,\n`),
        ']'
    )
    return lines.join("\n")
}

async function getFiles(absoluteDir, extensions, ignore, _path = '', _nested = false, layouts = []) {
    const list = []
    const files = await fs.readdirSync(absoluteDir)
    const sortedFiles = moveToFront(files, ['_layout.svelte'])
    await asyncForEach(sortedFiles, async filename => {
        const ignoreFile = ignore.filter(ignoreStr => filename.match(ignoreStr)).length
        if (ignoreFile) return;


        const _filepath = path.resolve(absoluteDir + '/' + filename)
        const isDir = await fs.statSync(_filepath).isDirectory()
        const [noExtName, ext] = splitString(filename, '.')

        const isLayout = noExtName === '_layout'
        const filepath = _path + '/' + filename

        if (!isLayout && filename.match(/^_/)) return //skip underscore prefixed files that aren't layout

        if (isLayout) layouts.push(filepath)

        if (isDir) {
            const nestedList = await getFiles(_filepath, extensions, ignore, filepath, true, [...layouts])
            list.push(...nestedList)
        }

        if (extensions.includes(ext))
            list.push({ filepath, layouts, isLayout })
    })
    return list
};

function _filesToRoutes(files) {
    return files

        .map(route => {
            route.path = stripExtension(route.filepath)
            route.component = makeLegalIdentifier(route.path)
            if (!route.isLayout) {
                route.layouts = route.layouts.map(layout => makeLegalIdentifier(stripExtension(layout)))
                route.paramKeys = getParams(route.path)
                route.regex = route.isLayout ? null : getRegex(route.path)
                route.name = route.path.match(/[^\/]*\/[^\/]+$/)[0].replace(/[^\w\/]/g, '') //last dir and name, then replace all but \w and /
                route.ranking = route.path.split('/').map(str => str.match(/\[|\]/) ? 'A' : 'Z').join('')
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
            sortedArray.push(array.splice(pos, pos + 1)[0])
    })
    sortedArray.push(...array)
    return sortedArray
}

function getRegex(str) {
    return '^' + str.replace(MATCH_BRACKETS, '([^/]+)')

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