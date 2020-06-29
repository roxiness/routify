const {exec, fs} = require('./shared')


async function createStarterExample({ cwd, branch }) {
    fs.mkdirSync(cwd, { recursive: true })
    exec(`routify init --branch ${branch}`, { cwd })    
    exec('npm link @sveltech/routify', { cwd })
}

module.exports = createStarterExample