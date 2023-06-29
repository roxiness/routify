export function renderModule(module: (SvelteComponentDev | {
    default: SvelteComponentDev;
}) & {
    load: (url: string) => Promise<any>;
}, compositeUrl: string): Promise<any>;
import { SvelteComponentDev } from "svelte/types/runtime/internal/dev";
