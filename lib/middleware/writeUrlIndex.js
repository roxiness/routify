const { nodeMiddlewareSync } = require('../utils/middleware')
const fileWriter = require('../services/file-writer')

module.exports = function writeUrlIndex(payload) {
    const { options, tree } = payload
    const flatList = []
    nodeMiddlewareSync(payload => {
        const { file } = payload
        const { isPage, path, meta } = file
        const hasParam = path.match(/\/\:/)
        const unwanted = meta.prerender === false
        if (isPage && !hasParam && !unwanted)
            flatList.push(file.path)
    }, { file: tree })
    fileWriter(JSON.stringify(flatList, null, 2), options.routifyDir + '/urlIndex.json')
}