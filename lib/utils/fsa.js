const fs = require('fs')
const { promisify: pp } = require('util')

const promisify = fn => pp(fn.bind(fs))

// promisified fs
module.exports = {
  exists: (...args) => new Promise(resolve => fs.exists(...args, resolve)),
  mkdir: promisify(fs.mkdir),
  readdir: promisify(fs.readdir),
  stat: promisify(fs.stat),
  writeFile: promisify(fs.writeFile),
}
