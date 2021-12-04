/// <reference types="svelte/types/runtime/ambient" />
export const Routify: typeof RoutifyRuntime;
export * from "./helpers/index.js";
export * from "../common/helpers.js";
import { RoutifyRuntime } from "./Instance/RoutifyRuntime.js";
import { createRouter } from "./Router/Router.js";
import Router from "*.svelte";
import { Router as RouterClass } from "./Router/Router.js";
import { globalInstance } from "./Global/Global.js";
import { AddressReflector } from "./Router/urlReflectors/Address.js";
import { LocalStorageReflector } from "./Router/urlReflectors/LocalStorage.js";
import { InternalReflector } from "./Router/urlReflectors/Internal.js";
import Component from "*.svelte";
export { createRouter, Router, RouterClass, globalInstance, AddressReflector, LocalStorageReflector, InternalReflector, Component };
