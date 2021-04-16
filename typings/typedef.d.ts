type Routify = typeof import("./common/Routify")['Routify']['prototype'];
type RoutifyCallback<T> = (first: {
    instance: Routify;
}) => T | Promise<T>;
type RoutifyPlugin = {
    /**
     * name of plugin(s) to run before
     */
    before?: (string | string[]) | undefined;
    /**
     * name of plugin(s) to run after
     */
    after?: (string | string[]) | undefined;
    /**
     * run plugin if true
     */
    condition?: RoutifyCallback<boolean> | undefined;
    /**
     * plugin script
     */
    run: RoutifyCallback<any>;
    mode: 'compile' | 'runtime';
};
