const fs = require('fs')
const path = require('path')
const { resolve, relative } = require('path')
const log = require('../utils/log')
const config = {}
const defaults = require('../../config.defaults.json')
const { ssr } = require('@sveltech/ssr')

module.exports.exporter = async function exporter(params) {
    params = { ...defaults, ...config, ...params }

    const distDir = getAbsolutePath(params.distDir)
    const routesPath = getAbsolutePath(params.routifyDir, 'urlIndex.js')
    const basepaths = params.basepath
    const urls = require(routesPath)
    const entrypoint = `${distDir}/__app.html`

    log(`Exporting to: ${relative(process.cwd(), distDir)}`)
    await saveUrls(urls, basepaths, distDir, entrypoint)
    log(`Generated ${urls.length} static pages`)
    log(`Export finished`)
    log(`Build can be served from ./${path.relative(process.cwd(), distDir)} and is ready to be deployed`)
}

async function saveUrls(urls, basepath = "", distDir, entrypoint) {
    const script = fs.readFileSync(require.resolve(distDir + '/build/bundle.js'), 'utf8')
    const template = fs.readFileSync(require.resolve(entrypoint), 'utf8')
    const basepaths = (Array.isArray(basepath) ? basepath : basepath.split(','))

    for (const baseIndex in basepaths)
        for (const i in urls) {
            const url = `/${basepaths[baseIndex]}/${urls[i]}`.replace(/\/+/g, '/')
            const html = await ssr(template, script, url, {
                meta: { 'data-render': 'prerendered' },
                host: 'http://localhost'
            })
            const file = resolve(distDir + url + '.html').replace(/\\/g, '/')
            const children = (file.split('/').slice(0, -1).join('/'))
            fs.mkdirSync(children, { recursive: true })
            fs.writeFileSync(file, html + '\n<!--prerendered-->')
        }
    return true
}



function getAbsolutePath(...paths) {
    return resolve(process.cwd(), ...paths).replace(/\\/g, '/')
}
