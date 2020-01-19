const puppeteer = require('puppeteer');
const fs = require('fs')
const { resolve, relative } = require('path')
const { ncp } = require('ncp')
const readdirp = require('readdirp')
const log = require('./log')
const fsa = require('../utils/fsa')
const kill = require('tree-kill')

module.exports.defaultOptions = {
    output: 'export',
    routes: 'node_modules/@sveltech/routify/tmp',
    source: 'public',
    baseurl: 'http://localhost:5000',
    serverScript: 'start'
}

module.exports.exporter = async function exporter(params) {
    const serverScript = params.serverScript
    const outputPath = getAbsolutePath(params.output)
    const routesPath = getAbsolutePath(params.routes, 'urlIndex.js')
    const sourcePath = getAbsolutePath(params.source)
    const oldFilesIndex = getAbsolutePath(outputPath, '__exported_files.json')
    const baseurl = params.baseurl
    const paths = require(routesPath)
    log(`Exporting to: ${relative(process.cwd(), outputPath)}`)

    const child = startServer(serverScript)
    await deleteOldFiles(oldFilesIndex)

    const _files = await readdirp.promise(sourcePath)
    const copiedFiles = _files.map(({ path }) => getAbsolutePath(outputPath, path))

    ncp(sourcePath, outputPath, () => log('Copied source'))
    const generatedFiles = await saveUrls(paths, baseurl, outputPath)
    log('Generated pages')

    const oldFiles = JSON.stringify([...copiedFiles, ...generatedFiles], 0, 2)
    fs.writeFileSync(getAbsolutePath(outputPath, '__exported_files.json'), oldFiles)

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

async function deleteOldFiles(oldFilesIndex) {
    if (fs.existsSync(oldFilesIndex)) {
        const oldFiles = require(oldFilesIndex)
        oldFiles.push(oldFilesIndex)
        const promise = oldFiles.map(path => fsa.unlink(path))
        await Promise.all(promise)
        log('deleted old files')
    }
    return
}

async function saveUrls(paths, baseUrl, destination) {
    const browser = await puppeteer.launch();
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