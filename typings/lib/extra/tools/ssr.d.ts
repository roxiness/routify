export function renderModule(module: (SvelteComponentDev | {
    default: SvelteComponentDev;
}) & {
    load: (url: string) => Promise<any>;
}, urlOrOptions: any): Promise<any>;
import { SvelteComponentDev } from "svelte/types/runtime/internal/dev";
