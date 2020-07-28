const test = require('ava');
const browserTest = require('../../playwright-test')
const { resolve } = require('path')
const { existsSync, mkdirSync, removeSync, } = require('fs-extra')
const { execSync, spawn, exec, fork, spawnSync } = require('child_process');
const baseOutputDir = resolve(process.cwd(), 'output')
const outputDir = resolve(baseOutputDir, 'routify')


test.serial('init creates new project', async t => {
    t.timeout(1000 * 300)
    if (existsSync(outputDir)) removeSync(outputDir, { recursive: true })
    t.log('deleted dir')

    mkdirSync(outputDir)
    t.log('created dir')
    const child = await execSync('npx @roxi/routify init', { cwd: outputDir })
    t.assert(existsSync(resolve(outputDir, 'node_modules')))
    t.assert(existsSync(resolve(outputDir, 'src')))
    t.assert(existsSync(resolve(outputDir, 'scripts')))
    t.is(2, 2)
})

browserTest.serial('new project can run dev', async (t, page, context) => {
    const child = spawn('npm', ['run', 'dev'], { shell: true, cwd: outputDir })

    await new Promise((resolve, reject) => {
        const log = []
        child.stdout.on('data', data => {
            log.push(data.toString())
            if (data.toString().match(/Serving spa on/)) resolve()
        })
        child.stdout.on('error', data => reject(data.toString()))
        setTimeout(() => { reject(log.join('\n')) }, 14 * 1000)
    })

    await page.goto('http://localhost:5000')
    t.assert(await page.$('"Routify Starter"'))

    require('tree-kill')(child.pid)
})

test.serial('new project can build', async t => {
    removeSync(resolve(outputDir, 'dist'))
    t.false(existsSync(resolve(outputDir, 'dist/index.html')))
    const child = execSync('npm run build', { shell: true, cwd: outputDir })
    t.truthy(existsSync(resolve(outputDir, 'dist/index.html')))
})

browserTest.serial('builds can be served', async (t, page, context) => {
    const child = spawn('npm', ['run', 'serve'], { shell: true, cwd: outputDir })

    await page.goto('http://localhost:5000')
    t.assert(await page.$('"Routify Starter"'))

    await page.goto('http://localhost:5005')
    t.assert(await page.$('"Routify Starter"'))

    require('tree-kill')(child.pid)
})
