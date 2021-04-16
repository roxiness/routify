/// <reference types="node" />
export class File {
    constructor(path: any);
    path: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
    fullpath: any;
    fulldir: string;
    get stat(): import("fs").Stats;
}
