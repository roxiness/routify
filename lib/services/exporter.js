const fs = require('fs')
const { resolve, relative, dirname } = require('path')
const log = require('../utils/log')
const { ssr } = require('@sveltech/ssr')
const { getConfig } = require('./config')

module.exports.exporter = async function exporter(params) {
    params = getConfig(params)
    const { basepath = "", distDir, convertToIndex, routifyDir } = params
    const entrypoint = `${distDir}/__app.html`
    
    const urls = require(resolve(routifyDir, 'urlIndex.json'))
    const script = fs.readFileSync(winResolve(distDir, 'build/bundle.js'), 'utf8')
    const template = fs.readFileSync(entrypoint, 'utf8')
    const basepaths = Array.isArray(basepath) ? basepath : basepath.split(',')
    log(`Exporting to: ${distDir}`)

    for (const baseIndex in basepaths)
        for (const i in urls) {
            const url = `/${basepaths[baseIndex]}/${urls[i]}`.replace(/\/+/g, '/')
            console.log(url)
            const html = await ssr(template, script, url, {
                meta: { 'data-render': 'prerendered' },
                host: 'http://localhost'
            })
            const file = !url.endsWith('/index') && convertToIndex ? '/index.html' : '.html'
            const filepath = winResolve(distDir + url + file)
            fs.mkdirSync(dirname(filepath), { recursive: true })
            fs.writeFileSync(filepath, html + '\n<!--prerendered-->')
        }

    log(`Generated ${urls.length} static pages`)
    log(`Export finished`)
    log(`Build can be served from ./${relative(process.cwd(), distDir)} and is ready to be deployed`)
}

function winResolve(...paths) {
    return resolve(...paths).replace(/\\/g, '/')
}
