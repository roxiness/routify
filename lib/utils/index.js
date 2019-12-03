module.exports.sanitizeOptions = function (defaultOptions, inputOptions) {
    const options = {}
    Object.keys(defaultOptions).forEach(key => {
        options[key] = (key in inputOptions) ? inputOptions[key] : defaultOptions[key]
    })
    return options
}

module.exports.asyncForEach = async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports.splitString = function splitString(str, delimiter) {
    const pos = str.lastIndexOf(delimiter)
    if (pos === -1)
        return [str, null]
    return [
        str.substr(0, pos),
        str.substr(pos + 1)
    ]
}