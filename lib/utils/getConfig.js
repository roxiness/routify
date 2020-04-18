const fs = require('fs');
const fileWriter = require('../services/file-writer.js')
const defaultOptions = { timeout: 2000, unreadOnly: false, scope: 'all' }

module.exports.default = function (options) {
    return new Promise((resolve, reject) => {
        options = { ...defaultOptions, ...options }
        const { timeout, unreadOnly, scope } = options
        const path = __dirname + '/../../tmp/config.json'
        const lookingSince = new Date
        let config
        const checkConfig = setInterval(getFile, 10)

        function getFile() {
            const now = new Date
            if (now - lookingSince > timeout) {
                clearInterval(checkConfig)
                reject(config ? 'timed out while waiting for config to update' : 'timed out while looking for config')
            }

            try {
                if (fs.existsSync(path)) {
                    const file = fs.readFileSync(path, 'utf8')
                    config = JSON.parse(file, 'utf8')
                    config.read = config.read || {}
                    const read = config.read[scope]
                    const then = new Date(config.started)
                    const tooOld = now - then > timeout
                    const readStateOk = !read || !unreadOnly

                    if (!tooOld && readStateOk) {
                        clearInterval(checkConfig)
                        resolve(config)

                        config.read[scope] = new Date().toISOString()
                        fileWriter(JSON.stringify(config, 0, 2), path)
                    }
                }
            } catch (err) { }
        }
    })
}

