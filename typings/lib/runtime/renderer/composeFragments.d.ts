export function findNearestInlineContext(context: any): any;
export function contextHasMatchingFragmentAndParams(f: RouteFragment): (c: RenderContext) => boolean;
export function nodeIsIndexed(node: RNodeRuntime): boolean;
export function fetchIndexNode(node: RNodeRuntime): import("../Instance/RNodeRuntime").RNodeRuntime;
export function addFolderDecorator(decorators: Decorator[], context: RenderContext): void | Promise<void>;
export function defaultscrollBoundary(ownContext: any): any;
export function findActiveChildContext(childContexts: RenderContext[], fragment: RouteFragment): RenderContext;
import { RouteFragment } from "../Route/RouteFragment";
import { RenderContext } from "./RenderContext";
