const puppeteer = require('puppeteer');
const chromium = require('chrome-aws-lambda');
const fs = require('fs')
const { resolve, relative } = require('path')
const { ncp } = require('ncp')
const log = require('./log')
const kill = require('tree-kill')

module.exports.defaultOptions = {
    output: 'app/dist',
    routes: 'node_modules/@sveltech/routify/tmp',
    source: 'app/public',
    baseurl: 'http://localhost:5000',
    serverScript: 'start',
    noPrerender: false
}

module.exports.exporter = async function exporter(params) {
    const serverScript = params.serverScript
    const outputPath = getAbsolutePath(params.output)
    const routesPath = getAbsolutePath(params.routes, 'urlIndex.js')
    const sourcePath = getAbsolutePath(params.source)
    const baseurl = params.baseurl
    const paths = require(routesPath)
    log(`Exporting to: ${relative(process.cwd(), outputPath)}`)

    const child = startServer(serverScript)

    ncp(sourcePath, outputPath, () => log('Copied public'))

    if (!params.noPrerender) {
        const res = await saveUrls(paths, baseurl, outputPath)
        log(`Generated ${res.length} static pages`)
    }

    kill(child.pid)
    log(`Export finished`)
    log(`Run "npm run serve:export" to see the result`)
}

function startServer(serverScript) {
    const stdio = process.env.DEBUG ? 'inherit' : 'ignore'
    return require('child_process').spawn('npm', ['run', serverScript], {
        stdio,
        shell: true
    });
}

async function saveUrls(paths, baseUrl, destination) {
    const browser = await chromium.puppeteer.launch({
        executablePath: await chromium.executablePath
      });
    const _savedUrls = paths.map(path => saveUrl(path, baseUrl, destination, browser))
    const savedUrls = await Promise.all(_savedUrls)
    await browser.close();
    return savedUrls;
}

async function saveUrl(path, baseUrl, destination, browser) {
    const file = resolve(destination + path + '.html').replace(/\\/g, '/')
    const dir = (file.split('/').slice(0, -1).join('/'))
    const url = baseUrl + path
    fs.mkdirSync(dir, { recursive: true })
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForFunction('window.routify === "ready"')
    const html = await page.content()
    fs.writeFileSync(file, html)
    return file
}

function getAbsolutePath(...paths) {
    return resolve(process.cwd(), ...paths).replace(/\\/g, '/')
}