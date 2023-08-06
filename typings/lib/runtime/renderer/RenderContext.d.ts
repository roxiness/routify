export class RouterContext {
    /** @param {{router: Router}} params */
    constructor({ router }: {
        router: Router;
    });
    /** @type {import('svelte/store').Writable<RenderContext[]>} */
    childContexts: import('svelte/store').Writable<RenderContext[]>;
    /** @type {import('svelte/store').Writable<RouteFragment[]>} */
    childFragments: import('svelte/store').Writable<RouteFragment[]>;
    /** @type {import('svelte/store').Writable<RenderContext>} */
    activeChildContext: import('svelte/store').Writable<RenderContext>;
    /** @type {RenderContext} */
    lastActiveChildContext: RenderContext;
    /** @type {Decorator[]} */
    decorators: Decorator[];
    router: import("..").RouterClass;
    route: import("../Route/Route").Route;
    /**
     * @param {Partial<{inline: InlineInput, decorator:DecoratorInput, props, options, anchor: AnchorLocation, scrollBoundary: scrollBoundary}>} options
     *
     * */
    buildChildContexts(options: Partial<{
        inline: InlineInput;
        decorator: DecoratorInput;
        props: any;
        options: any;
        anchor: AnchorLocation;
        scrollBoundary: scrollBoundary;
    }>, newDecorators: any): void;
    updateChildren(): void;
}
export class RenderContext extends RouterContext {
    /**
     *
     * @param {{
     *   node: RNodeRuntime
     *   paramsPool: Object.<string, string[]>
     *   rawInlineInputFromSlot: InlineInput
     *   parentContext: RenderContext | RouterContext
     *   newDecorators: Decorator[]
     *   contextOptions: RenderContextOptions
     *   scrollBoundary: scrollBoundary
     *   anchorLocation: AnchorLocation
     *   router?: Router
     *   props: Object
     * }} param0
     */
    constructor({ node, paramsPool, rawInlineInputFromSlot, parentContext, newDecorators, contextOptions, scrollBoundary, anchorLocation, router, props, }: {
        node: RNodeRuntime;
        paramsPool: {
            [x: string]: string[];
        };
        rawInlineInputFromSlot: InlineInput;
        parentContext: RenderContext | RouterContext;
        newDecorators: Decorator[];
        contextOptions: RenderContextOptions;
        scrollBoundary: scrollBoundary;
        anchorLocation: AnchorLocation;
        router?: Router;
        props: any;
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
    onDestroy: import("hookar").CollectionSyncVoid<any> | import("hookar").CollectionAsyncVoid<any>;
    mounted: DeferredPromise<any>;
    /** @type {RouterContext} */
    routerContext: RouterContext;
    props: any;
    fragment: RouteFragment;
    params: import("svelte/store").Writable<{}>;
    parentContext: RenderContext;
    options: Partial<{
        inline: InlineInput;
        decorator: DecoratorInput;
        props: any;
        options: any;
        anchor: import("../decorators/AnchorDecorator").Location;
        scrollBoundary: scrollBoundary;
    }>;
    scrollBoundary: scrollBoundary;
    get parentOrRouterContext(): any;
    setToActive(): void;
    update(activeSiblingContext: any): void;
    /** updates params with accumulated values, starting from the root context */
    updateParams(): void;
}
import { RouteFragment } from "../Route/RouteFragment";
