export function findNearestInlineContext(context: any): any;
export function contextHasMatchingFragmentAndParams(f: RouteFragment): (c: RenderContext) => boolean;
export function nodeIsIndexed(node: RNodeRuntime): boolean;
export function fetchIndexNode(node: RNodeRuntime): import("../Instance/RNodeRuntime.js").RNodeRuntime;
export function addFolderDecorator(decorators: Decorator<any>[], context: RenderContext | RouterContext): void | Promise<void>;
export function addFolderWrapper(decorators: Decorator<any>[], context: RenderContext | RouterContext): void | Promise<void>;
export function defaultscrollBoundary(ownContext: any): any;
export function findActiveChildContext(childContexts: RenderContext[], fragment: RouteFragment): RenderContext;
import { RouteFragment } from "../Route/RouteFragment.js";
import { RenderContext } from "./RenderContext.js";
