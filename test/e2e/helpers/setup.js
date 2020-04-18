const { getBranch, exec, log } = require('./shared')
const installRoutify = require('./installRoutify')
const createStarterExample = require('./createStarterExample')
const purger = require('./purger')
const path = require('path')

async function setup({ projectDir, buildsDir, purge, branch }) {
    branch = branch || await getBranch(projectDir)
    const buildDir = path.resolve(buildsDir, `starter-template#${branch}`)
    
    if(purge) log.title('Purging')
    if(purge) await purger({projectDir, buildsDir})
    log.title('Installing Routify')
    await installRoutify({ projectDir })
    log.title('Creating Starter example')
    await createStarterExample({ cwd: buildDir, branch })
}

module.exports = setup