export function normalizeRoutesDir(input: string | ({
    default: string;
} & {
    [x: string]: string;
})): {
    default: string;
} & {
    [x: string]: string;
};
