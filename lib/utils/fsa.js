const fs = require('fs')
const { promisify: pp } = require('util')

const from = fs => {
  const promisify = fn => pp(fn.bind(fs))
  return {
    exists: (...args) => new Promise(resolve => fs.exists(...args, resolve)),
    mkdir: promisify(fs.mkdir),
    readdir: promisify(fs.readdir),
    stat: promisify(fs.stat),
    readFile: promisify(fs.readFile),
    writeFile: promisify(fs.writeFile),
    unlink: promisify(fs.unlink),
  }
}

// promisified fs
module.exports = {
  ...from(fs),
  from,
}
