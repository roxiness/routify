declare namespace _default {
    export namespace queryHandler {
        export function parse(search: any): any;
        export function stringify(params: any): string;
    }
    export namespace urlTransform {
        export function apply(x: any): any;
        export function remove(x: any): any;
    }
    export const useHash: boolean;
}
export default _default;
