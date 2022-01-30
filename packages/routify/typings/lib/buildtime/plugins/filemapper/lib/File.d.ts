/// <reference types="node" />
export class File {
    constructor(path: any);
    path: string;
    dir: string;
    base: string;
    ext: string;
    fullpath: any;
    fulldir: string;
    name: string;
    get stat(): import("fs").Stats;
}
