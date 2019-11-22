const fs = require('fs')
const { promisify } = require('util')

// promisified fs
module.exports = {
  exists: promisify(fs.exists),
  readdir: promisify(fs.readdir),
  stat: promisify(fs.stat),
}
