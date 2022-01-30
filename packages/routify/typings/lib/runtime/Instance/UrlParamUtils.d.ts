export class UrlParamUtils {
    constructor(RE?: RegExp);
    RE: RegExp;
    /**
     * returns ["slug", "id"] from "my[slug]and[id]"
     * @param {string} name
     * @returns {string[]}
     */
    getFieldsFromName: (name: string) => string[];
    /**
     * converts "my[slug]and[id]" to /my(.+)and(.+)/gm
     * @param {string} name
     * @returns {RegExp}
     */
    getRegexFromName: (name: string) => RegExp;
    /**
     * returns an array of values matching a regular expresion and path
     * @param {RegExp} re
     * @param {string} path
     * @returns {string[]}
     */
    getValuesFromPath: (re: RegExp, path: string) => string[];
    /**
     * converts (['a', 'b', 'c'], [1, 2, 3]) to {a: 1, b: 2, c: 3}
     * @param {string[]} fields
     * @param {string[]} values
     * @returns
     */
    mapFieldsWithValues: (fields: string[], values: string[]) => {};
    haveEqualLength: (fields: any, values: any) => boolean;
}
