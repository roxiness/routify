export function renderModule(module: (SvelteComponentDev | {
    default: SvelteComponentDev;
}) & {
    load: (url: string) => Promise<any>;
}, compositeUrl: string): Promise<any>;
export function preloadUrlFromUrlPairs(urlPairs: UrlPair): Promise<void>;
export function preloadUrl(url?: (string | string[]) | undefined): Promise<void[]>;
export type UrlPair = [name: string, url: string];
import { SvelteComponentDev } from "svelte/types/runtime/internal/dev.js";
