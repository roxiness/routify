export function from(fs: any): {
    exists: (...args: any[]) => Promise<any>;
    mkdir: Function;
    readdir: Function;
    stat: Function;
    readFile: Function;
    writeFile: Function;
    unlink: Function;
    realpath: Function;
};
export declare function exists(...args: any[]): Promise<any>;
export declare const mkdir: Function;
export declare const readdir: Function;
export declare const stat: Function;
export declare const readFile: Function;
export declare const writeFile: Function;
export declare const unlink: Function;
export declare const realpath: Function;
