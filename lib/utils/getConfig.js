const fs = require('fs');
const fileWriter = require('../services/file-writer.js')
const defaultOptions = { timeout: 2000, unreadOnly: false, scope: 'all' }

module.exports.default = function (options) {
    return new Promise((resolve, reject) => {
        options = { ...defaultOptions, ...options }
        const { timeout, unreadOnly, scope } = options
        const path = __dirname + '/../../tmp/config.json'
        const lookingSince = Date.now()
        let config
        const checkConfig = setInterval(getFile, 10)

        function getFile() {
            const now = Date.now()
            if (now - lookingSince > timeout) {
                clearInterval(checkConfig)
                reject(config ? 'timed out while waiting for config to update' : 'timed out while looking for config')
            }

            try {
                if (fs.existsSync(path)) {
                    const file = fs.readFileSync(path, 'utf8')
                    config = JSON.parse(file)
                    config.read = config.read || {}
                    const read = config.read[scope]
                    const then = new Date(config.started).getTime()
                    const tooOld = now - then > timeout
                    const readStateOk = !read || !unreadOnly

                    if (!tooOld && readStateOk) {
                        clearInterval(checkConfig)
                        resolve(config)

                        config.read[scope] = new Date().toISOString()
                        fileWriter(JSON.stringify(config, null, 2), path)
                    }
                }
            } catch (err) { }
        }
    })
}

