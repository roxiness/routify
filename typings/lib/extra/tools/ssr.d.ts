export function renderModule(module: (SvelteComponentDev | {
    default: SvelteComponentDev;
}) & {
    load: (url: string) => Promise<any>;
}, urlOrOptions?: (string | string[] | import('../../runtime').PreloadOptions) | undefined): Promise<any>;
import { SvelteComponentDev } from "svelte/types/runtime/internal/dev";
