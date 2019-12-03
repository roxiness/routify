const fs = require('fs')
const { promisify } = require('util')

// promisified fs
module.exports = {
  exists: promisify(fs.exists),
  mkdir: promisify(fs.mkdir),
  readdir: promisify(fs.readdir),
  stat: promisify(fs.stat),
  writeFile: promisify(fs.writeFile),
}
