import { statSync } from 'fs'
import { parse, relative } from 'path'



export class File {
    constructor(path) {
        const { dir, base, ext, name } = parse(path)
        this.path = relative(process.cwd(), path).replace(/\\/g, '/')
        this.dir = relative(process.cwd(), dir).replace(/\\/g, '/')
        this.base = base
        this.ext = ext
        this.name = name
        this.fullpath = path
        this.fulldir = dir
        Object.defineProperty(this, 'fullpath', { enumerable: false })
        Object.defineProperty(this, 'fulldir', { enumerable: false })
    }
    get stat() {
        return statSync(this.fullpath)
    }
}
