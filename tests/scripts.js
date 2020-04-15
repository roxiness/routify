const fse = require('fs-extra')
const path = require('path')
const { execSync, exec } = require('child_process')
const net = require('net');

const stdio = 'inherit'
const buildsDir = path.resolve(__dirname, 'builds')
const projectDir = path.resolve(__dirname, '..')
const starterExamplePort = "5000"

/**
 * @typedef {Object} Options
 * @prop {String} [name]
 * @prop {Boolean} [forceRebuildTest]
 * @prop {String} [branch]
 */

const defaults = {
    forceRebuildTest: false,
    name: 'testApp',
    branch: ""
}


function _log(...args) { console.log('🥼 [Routify]', ...args) }
function log(...args) { _log('   ', ...args) }
function logInfo(...args) { _log('🛈  ', ...args) }
function logWarning(...args) { _log('⚠  ', ...args) }
function logAction(...args) { _log('✎  ', ...args) }


// async function ensureStarterExample(options) {
//     console.log()
//     log('----------------------------------')
//     log('Ensure Starter Template is running')
//     log('----------------------------------')
//     const { port, name } = options
//     const isRunning = await portInUse(starterExamplePort)
//     isRunning ? logAction(`using existing app on port ${port}`) : logInfo(`🛈 no app running on port ${port}.`)
//     if (!isRunning) {
//         const cwd = `${buildsDir}/${name}`
//         logAction(`Setting directory for starter example to:`)
//         log(cwd)
//         await createStarterExample(options)
//         logAction(`Starting starter example`)
//         execSync(`npm run dev`, { cwd, stdio })
//     }
// }
createStarterExample({ name: 'starter-example' })

/**
 * 
 * @param {Options} options 
 */
async function createStarterExample(options) {
    const { branch, forceRebuildTest, name } = { ...defaults, ...options }
    const cwd = `${buildsDir}/${name}`
    const testBuildExists = fse.existsSync(cwd)
    const currentBranch = testBuildExists && await getBranch(cwd)
    const projectBranch = branch || await getBranch(projectDir)
    const sameBranch = branch === currentBranch

    if (forceRebuildTest) logInfo('Force rebuild is set to true')
    else {
        logInfo(testBuildExists ? `Found existing test build` : `Did not find existing test build.`)
        if (projectBranch) logInfo(sameBranch ? `Branch "${projectBranch}" matches request or project` : `Branch "${currentBranch}" did not match request or project branch: ${projectBranch}`)
    }

    if (!sameBranch || forceRebuildTest) {
        const cmd = `routify init --branch ${projectBranch}`
        if (testBuildExists) {
            logAction(`removing existing dir`)
            fse.removeSync(cwd)
        }
        fse.mkdirSync(cwd, { recursive: true })
        logAction('Creating new build with:')
        log('$', cmd)
        execSync(cmd, { cwd, stdio })
        createNpmLink(cwd)
    }
}

function createNpmLink(cwd) {
    logAction('Unlink Routify')
    execSync('npm unlink', { cwd: projectDir })
    logAction('Link Routify')
    execSync('npm link', { cwd: projectDir })
    logAction(`Link Routify to Starter Example`)
    execSync(`npm link @sveltech/routify`, { cwd })
}
ensureDependencies()
function ensureDependencies() {
    const modulesDir = path.resolve(projectDir, 'node_modules')
    const nodeModulesExists = fse.existsSync(modulesDir)
    nodeModulesExists ? logInfo(`${modulesDir} already exists`) : logAction('node_modules missing. Running "npm install".')
    if (!nodeModulesExists) {
        return exec('npm install', { cwd: projectDir })
    }
}



async function portInUse(port) {
    let inUse = null
    const server = net.createServer();
    server.on('error', (err) => {
        if (err.message.includes('EADDRINUSE')) inUse = true
        else throw (err)
    });
    server.on('listening', () => inUse = false)
    await server.listen(port)
    server.close()
    return inUse
}


async function getBranch(cwd) {
    return execSync('git rev-parse --abbrev-ref HEAD', { cwd }).toString().replace(/\n/, '')
}

module.exports = { ensureDependencies, ensureStarterExample }