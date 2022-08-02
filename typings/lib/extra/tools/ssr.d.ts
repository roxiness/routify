export function renderModule(module: (SvelteComponentDev | {
    default: SvelteComponentDev;
}) & {
    load: (url: string) => Promise<any>;
}, compositeUrl: string): Promise<any>;
export function preloadAllRoutersFromUrlPairs(urlPairs: UrlPair): Promise<void>;
export function preloadAllRouters(url: string): Promise<void>;
export type UrlPair = [name: string, url: string];
import { SvelteComponentDev } from "svelte/types/runtime/internal/dev.js";
