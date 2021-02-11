declare namespace _default {
    namespace queryHandler {
        function parse(search: any): any;
        function stringify(params: any): string;
    }
    namespace urlTransform {
        function apply(x: any): any;
        function remove(x: any): any;
    }
    const useHash: boolean;
}
export default _default;
