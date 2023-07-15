export function findNearestInlineContext(context: any): any;
export function updateVisibility(context: RenderContext): void;
export function contextHasMatchingFragmentAndParams(f: RouteFragment): (c: RenderContext) => boolean;
export function nodeIsIndexed(node: RNodeRuntime): boolean;
export function fetchIndexNode(node: RNodeRuntime): import("../Instance/RNodeRuntime").RNodeRuntime;
export function addFolderDecorator(decorators: Decorator[], context: RenderContext): Promise<void>;
export function defaultscrollBoundary(ownContext: any): any;
export function buildChildContexts(options: Partial<{
    inline: InlineInput;
    decorator: DecoratorInput;
    props: any;
    options: any;
    anchor: AnchorLocation;
    scrollBoundary: scrollBoundary;
}>, parentContext: RenderContext, newDecorators: any): RenderContext[];
export function findActiveChildContext(childContexts: any, fragment: any): any;
import { RenderContext } from "./RenderContext";
import { RouteFragment } from "../Route/RouteFragment";
