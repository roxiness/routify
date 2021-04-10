import { statSync } from "fs"
import { sep, parse, relative } from "path"



export class File {
    constructor(path, root) {
        const { dir, base, ext, name } = parse(path)
        this.path = path
        this.dir = dir
        this.base = base
        this.ext = ext
        this.name = name        
        this.relative = relative(root, path).replace(/\\/g, '/')
    }
    get stat() {
        return statSync(this.path)
    }
}
