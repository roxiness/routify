import { statSync } from "fs"


export class File {
    constructor(path) {
        this.path = path
    }
    get stat() {
        return statSync(this.path)
    }
}
