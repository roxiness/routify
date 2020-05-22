const test = require('ava');
const browserTest = require('../../playwright-test')
const { resolve } = require('path')
const { existsSync, mkdirSync, removeSync } = require('fs-extra')
const { execSync, spawn } = require('child_process');
const baseOutputDir = resolve(process.cwd(), 'output')
const outputDir = resolve(baseOutputDir, 'routify')


test.serial('init creates new project', async t => {
    t.timeout(10000*300)
    if (existsSync(outputDir)) removeSync(outputDir, { recursive: true })
    t.log('deleted dir')
    
    mkdirSync(outputDir)
    t.log('created dir')
    const child = await execSync('npx @sveltech/routify init', { cwd: outputDir })
    t.assert(existsSync(resolve(outputDir, 'node_modules')))
    t.assert(existsSync(resolve(outputDir, 'src')))
    t.assert(existsSync(resolve(outputDir, 'scripts')))
})

browserTest.serial('new project can run dev', async (t, page, context) => {
    spawn('npm', ['run', 'dev'], {cwd: outputDir})
    page.goto('http://localhost:5000')
})

