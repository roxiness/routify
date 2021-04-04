import { statSync } from "fs"
import { sep, parse } from "path"


export class File {
    constructor(path) {
        const { dir, base, ext, name } = parse(path)
        this.path = path
        this.dir = dir
        this.base = base
        this.ext = ext
        this.name = name
    }
    get stat() {
        return statSync(this.path)
    }
}
