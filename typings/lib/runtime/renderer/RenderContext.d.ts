export class RenderContext {
    /**
     *
     * @param {{
     *   node: RNodeRuntime
     *   paramsPool: Object.<string, string[]>
     *   rawInlineInputFromSlot: InlineInput
     *   parentContext: RenderContext
     *   newDecorators: Decorator[]
     *   contextOptions: RenderContextOptions
     *   scrollBoundary: scrollBoundary
     *   anchorLocation: AnchorLocation
     * }} param0
     */
    constructor({ node, paramsPool, rawInlineInputFromSlot, parentContext, newDecorators, contextOptions, scrollBoundary, anchorLocation, }: {
        node: RNodeRuntime;
        paramsPool: {
            [x: string]: string[];
        };
        rawInlineInputFromSlot: InlineInput;
        parentContext: RenderContext;
        newDecorators: Decorator[];
        contextOptions: RenderContextOptions;
        scrollBoundary: scrollBoundary;
        anchorLocation: AnchorLocation;
    });
    anchorLocation: string;
    /** @type {RNodeRuntime} */
    node: RNodeRuntime;
    isActive: import("svelte/store").Writable<boolean>;
    isVisible: import("svelte/store").Writable<boolean>;
    wasVisible: boolean;
    isInline: boolean;
    /** @type {Inline} */
    inline: Inline;
    /** @type {import('svelte/store').Writable<{ parent: HTMLElement, anchor: HTMLElement }>} */
    elem: import('svelte/store').Writable<{
        parent: HTMLElement;
        anchor: HTMLElement;
    }>;
    /** @type {Route} */
    route: Route;
    /** @type {import('svelte/store').Writable<RenderContext[]>} */
    childContexts: import('svelte/store').Writable<RenderContext[]>;
    /** @type {import('svelte/store').Writable<RenderContext>} */
    activeChildContext: import('svelte/store').Writable<RenderContext>;
    /** @type {RenderContext} */
    lastActiveChildContext: RenderContext;
    onDestroy: import("hookar").CollectionSyncVoid<any> | import("hookar").CollectionAsyncVoid<any>;
    mounted: DeferredPromise<any>;
    childFragments: import("svelte/store").Writable<RouteFragment[]>;
    fragment: RouteFragment;
    router: any;
    parentContext: RenderContext;
    decorators: Decorator[];
    options: Partial<{
        inline: InlineInput;
        decorator: DecoratorInput;
        props: any;
        options: any;
        anchor: import("../decorators/AnchorDecorator").Location;
        scrollBoundary: scrollBoundary;
    }>;
    scrollBoundary: scrollBoundary;
    updateVisibility(): void;
}
import { RouteFragment } from "../Route/RouteFragment";
