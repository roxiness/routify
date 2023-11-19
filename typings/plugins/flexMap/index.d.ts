export function flexMapsPlugin(options: Partial<FlexMapPluginOptions>): RoutifyBuildtimePlugin[];
export type FlexMapPluginOptions = {
    /**
     * - an array of variations for each route dir.
     */
    variationsMap?: {
        [x: string]: string[];
    };
};
