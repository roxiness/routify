export function normalizeMulti(multiInput: MultiInput, refNode: RNodeRuntime | null, parentContext: any): Multi;
export type MultiPage = string | RNodeRuntime;
export type Multi = {
    pages: RNodeRuntime[];
    single: boolean;
};
export type MultiInput = boolean | MultiPage[] | Partial<{
    pages: MultiPage[];
    single: boolean;
}>;
