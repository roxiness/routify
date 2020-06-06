const { exec, log } = require('./shared')

async function installRoutify({ projectDir }) {
    exec('npm unlink', { cwd: projectDir })
    exec('npm install', { cwd: projectDir })
    exec('npm link', { cwd: projectDir })
}

module.exports = installRoutify