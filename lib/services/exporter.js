const fs = require('fs')
const { resolve, relative } = require('path')
const log = require('./log')
const config = require('config') || {}
const defaults = require('../../config.defaults.json')
const { ssr } = require('@sveltech/ssr')

module.exports.exporter = async function exporter(params) {
    params = { ...defaults, ...config, ...params }

    if (params.noPrerender) {
        log('Skipping prerenderes')
        return true
    }

    const distDir = getAbsolutePath(params.distDir)
    const routesPath = getAbsolutePath(params.routifyDir, 'urlIndex.js')
    const baseurl = params.baseurl
    const urls = require(routesPath)

    log(`Exporting to: ${relative(process.cwd(), distDir)}`)
    await saveUrls(urls, baseurl, distDir)
    log(`Generated ${urls.length} static pages`)
    log(`Export finished`)
    log(`Run "npm run serve:export" to see the result`)
}

async function saveUrls(urls, baseUrl, distDir) {
    const script = fs.readFileSync(require.resolve(distDir + '/build/bundle.js'), 'utf8')
    const template = fs.readFileSync(require.resolve(distDir + '/__app.html'), 'utf8')

    const _urls = urls
    for (const i in _urls) {
        const url = urls[i]
        const html = await ssr(template, script, url, { meta: { 'data-render': 'prerendered' } })
        const file = resolve(distDir + url + '.html').replace(/\\/g, '/')
        const dir = (file.split('/').slice(0, -1).join('/'))
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(file, html + '\n<!--prerendered-->')
    }
    return true
}



function getAbsolutePath(...paths) {
    return resolve(process.cwd(), ...paths).replace(/\\/g, '/')
}