import { derived } from 'svelte/store'
import { contexts, populateUrl } from '../utils/index.js'

import { get } from 'svelte/store'
export * from './preload.js'

/**
 * gets most recent common ancestor
 * @param {RNodeRuntime} node1
 * @param {RNodeRuntime} node2
 */
export const getMRCA = (node1, node2) => {
    const lineage1 = [node1, ...node1.ancestors]
    const lineage2 = [node2, ...node2.ancestors]
    const mrca = lineage1.find(node => lineage2.includes(node))
    const index1 = lineage1.indexOf(mrca)
    const index2 = lineage2.indexOf(mrca)
    const descendants1 = lineage1.slice(0, index1).reverse()
    const descendants2 = lineage2.slice(0, index2).reverse()

    return { mrca, index1, index2, lineage1, lineage2, descendants1, descendants2 }
}

export const getPath = (node1, node2) => {
    const { index1, index2, lineage2 } = getMRCA(node1, node2)
    const backtrackSteps = index1
    const backtrackStr = backtrackSteps ? '../'.repeat(backtrackSteps) : ''
    const forwardSteps = index2

    const forwardStepsStr = lineage2
        .slice(0, forwardSteps)
        .reverse()
        .map(n => n.name)
        .join('/')
    return backtrackStr + forwardStepsStr
}

/**
 * @template T
 * @typedef {import('svelte/store').Readable<T>} Readable
 */

/**
 * @typedef {Object} IsActiveOptions
 * @prop {Boolean} [recursive=true] return true if descendant is active
 */

/**
 * @typedef {Object} $UrlOptions
 * @prop {boolean} strict Require internal paths. Eg. `/blog/[slug]` instead of `/blog/hello-world`
 * @prop {boolean} includeIndex suffix path with `/index`
 * @prop {boolean} silent suppress errors
 * @prop {'push'|'replace'} mode push to or replace in navigation history
 * @prop {Router} router the router to use
 * @prop {RNodeRuntime} node origin node
 */

/**
 * @typedef {Partial<{
 *  dontscroll: boolean,
 *  dontsmoothscroll: boolean,
 * [key:string]: *
 * }>} RouteState
 */

/**
 * @callback Goto
 * @param {string|RNodeRuntime} pathOrNode relative, absolute or named URL
 * @param {Object.<string, string>=} userParams
 * @param {Partial<$UrlOptions & RouteState>=} options
 * @type {Readable<Goto>} */
export const goto = {
    subscribe: (run, invalidate) => {
        const { router } = contexts

        return derived(url, $url =>
            /** @type {Goto} */
            (pathOrNode, userParams, options) => {
                /** @type {options} */
                const defaults = { mode: 'push', state: {} }
                options = { ...defaults, ...options }
                const newUrl = $url(pathOrNode, userParams, options)
                router.url[options.mode](newUrl, options.state)
                return ''
            },
        ).subscribe(run, invalidate)
    },
}

/**
 * @typedef {(<T extends string | RNodeRuntime | HTMLAnchorElement>(
 *   inputPath: T,
 *   userParams?: { [x: string]: string; },
 *   options?: Partial<$UrlOptions>
 * ) => T extends HTMLAnchorElement ? void : string)} Url
 */

/**
 * @type {Readable<Url>}
 */
export const url = {
    subscribe: (run, invalidate) => {
        // fragment doesn't always contain .route.router, it could be an inactive inlined page
        const { fragment, router } = contexts

        return derived(fragment.params, $params => {
            return (pathElemOrNode, params, options) => {
                const createUrl = getCreateUrl(fragment.fragment, router)
                // if we're dealing with a string, return the rendered url
                if (!(globalThis.HTMLElement && pathElemOrNode instanceof HTMLElement))
                    return createUrl(pathElemOrNode, params, options)

                // if we're dealing with an anchor element, update it
                const path = pathElemOrNode.getAttribute('href')
                pathElemOrNode.setAttribute('href', createUrl(path, $params, options))
            }
        }).subscribe(run, invalidate)
    },
}

/**
 * @typedef {((
 *   pathOrNode: string|RNodeRuntime,
 *   userParams?: { [x: string]: string; },
 *   options?: Partial<$UrlOptions>
 * ) => string)} UrlFromString
 */

/**
 * @param {RouteFragment} fragment
 * @returns {UrlFromString}
 */
export const getCreateUrl =
    (fragment, router) =>
    /** @type {UrlFromString} */
    (pathOrNode, userParams = {}, options = {}) => {
        let _inputPath =
            typeof pathOrNode === 'string'
                ? pathOrNode
                : pathOrNode === null
                ? '$leaf'
                : pathOrNode?.path

        const route = fragment.route
        options.strict = options.strict ?? true

        // in case we swapped the routes tree (rootNode), make sure we find
        // the node that corresponds with the previous origin
        // otherwise mrca will break as there's no shared ancestor
        const originNode = router.rootNode.traverse(fragment.node.path)

        // strip the start of inputPath that matches the router's root node path if it's not '/'
        if (router.rootNode.path !== '/' && _inputPath.startsWith(router.rootNode.path))
            _inputPath = _inputPath.substring(router.rootNode.path.length)
        const leafPath = route?.fragments[route.fragments.length - 1].node.path
        const inputPath = _inputPath.replace('$leaf', leafPath || fragment.node.path)

        // we want absolute urls to be relative to the nearest router. Ironic huh
        const offset = inputPath.startsWith('/') ? router.rootNode.path : ''
        const offsetPath = (offset + inputPath).replace(/^\/+/, '/')
        const isNamedPath = !offsetPath.startsWith('/') && !offsetPath.startsWith('.')
        let targetNode
        let paramsFromPath = {}
        if (isNamedPath) {
            targetNode = originNode.root.instance.nodeIndex.find(
                n => n.meta.name === path,
            )
        } else {
            const steps = originNode.getChainTo(offsetPath, {
                ...options,
                allowDynamic: !options.strict,
            })
            // if we don't have a strict path, we need to get the params from the path
            paramsFromPath = Object.assign({}, ...(steps.map(cs => cs.params) || []))
            targetNode = steps.pop().node
        }

        if (!targetNode) {
            console.error('could not find destination node', inputPath)
            return
        }
        // get lowest common ancestor
        const mrca = getMRCA(targetNode, router.rootNode).mrca
        const path = ('/' + getPath(mrca, targetNode)).replace(/\/index$/, '/')

        const params = {
            ...paramsFromPath,
            ...inheritedParams(targetNode, route || router.activeRoute.get()),
            ...userParams,
        }

        const hash = params['#']
        delete params['#']

        const urlHandler = obj => router.queryHandler.stringify(obj, route)
        const internalUrl = populateUrl(path, params, urlHandler)

        const externalUrl =
            router
                .getExternalUrl(internalUrl.path + internalUrl.query)
                .replace(/\/$/, '') || '/'
        if (hash) return externalUrl + '#' + hash
        return externalUrl
    }

// todo only one target node is checked in inheritedParams
/**
 * copies params from all fragments in the route chain
 * @param {RNodeRuntime} node
 * @param {Route} route
 */
const inheritedParams = (node, route) => {
    const params = route.allFragments.map(
        // if node is a descendant of the fragment's node, return params
        fragment => fragment.node.getChainToNode(node) && fragment.params,
    )
    return Object.assign({}, ...params)
}

/**
 * @type {Readable<Object.<string, any>>}
 */
export const params = {
    subscribe: (run, invalidate) => {
        return contexts.router.params.subscribe(run, invalidate)
    },
}

/**
 * @callback IsActive
 * @param {String|RNodeRuntime=} pathOrNode
 * @param {Object.<string,string>} [params]
 * @param {IsActiveOptions} [options]
 * @returns {Boolean}
 *
 * @type {Readable<IsActive>} */
export const isActive = {
    subscribe: (run, invalidate) => {
        const { fragment, router } = contexts
        return derived(router.activeRoute, () => isActiveUrl(fragment)).subscribe(
            run,
            invalidate,
        )
    },
}

/**
 *
 * @param {RenderContext} context
 * @param {string} path
 * @param {Object.<string, string>} params params to match against
 *
 */
const traverseContext = (context, path, params) => {
    const breadcrumbs = path.split('/')
    let targetContexts = [context]
    for (const crumb of breadcrumbs) {
        if (!targetContexts) return false
        if (crumb === '..') {
            targetContexts = [targetContexts[0].parentContext]
        } else if (crumb != '.') {
            const childContexts = targetContexts.map(ctx => get(ctx.childContexts)).flat()
            targetContexts = childContexts.filter(
                childContext => childContext.node.name === crumb,
            )
        }
    }

    const targetContext = targetContexts.find(ctx => {
        // get all ancestor params. ctx does not have ancestor prop. Only parentContext
        const paramsStores = [ctx.params, ...ctx.ancestors.map(ctx => ctx.params)]
        const existingParams = Object.assign({}, ...paramsStores.map(store => get(store)))

        // make sure each param in the params object is present in the context chain
        const allParamsArePresent = Object.entries(params).every(
            ([key, value]) => existingParams[key] === value,
        )

        return allParamsArePresent
    })

    return targetContext
}

export const isActiveFragment = {
    subscribe: (run, invalidate) => {
        const { fragment: context, router } = contexts

        const refresh = () => {
            /**
             * @param {string} path
             * @param {Object.<string, string | string[]>} params
             * @param {IsActiveOptions} options
             * @param {boolean} options.recursive also check if all ancestors are active
             */
            run((path, params, options) => {
                options = { recursive: false, ...options }
                const targetContext = traverseContext(context, path, params)
                if (!targetContext) return false

                const isActiveStores = [
                    targetContext.isActive,
                    ...((options.recursive &&
                        targetContext.ancestors.map(ctx => ctx.isActive)) ||
                        []),
                ]
                const isActive = isActiveStores.map(store => get(store)).every(Boolean)

                return isActive
            })
        }
        // need this or we get a ctx[2] is not a function error
        refresh()

        return router.activeRoute.subscribe(
            () => router.ready().then(refresh),
            invalidate,
        )
    },
}

/**
 *
 * @param {RenderContext} renderContext
 * @returns
 */
export const isActiveUrl = renderContext => {
    const { router, fragment } = renderContext

    /** @type {IsActive} */
    return (pathOrNode, params = {}, options = {}) => {
        let _path = typeof pathOrNode === 'string' ? pathOrNode : pathOrNode?.path

        /**
         * @type {{recursive: boolean, silent: TraverseOptions['silent']}}
         */
        const { recursive, silent } = { recursive: true, silent: 'report', ...options }
        const route = router.activeRoute.get()

        // if we're using a custom rootNode, we need to strip it from the path
        if (router.rootNode.path !== '/')
            _path = _path.substring(router.rootNode.path.length)

        /**
         * @type {TraverseOptions}
         */
        const chainOptions = {
            rootNode: router.rootNode,
            allowDynamic: false,
            includeIndex: !recursive,
            silent,
        }

        const allWantedParamsAreInActiveChain = Object.entries(params).every(
            ([key, value]) => route.params[key] === value,
        )
        if (!allWantedParamsAreInActiveChain) return false

        const wantedNode = _path.startsWith('.')
            ? fragment.node.traverse(_path, chainOptions)
            : router.rootNode.getChainTo(_path, chainOptions).pop().node

        const actNodes = [...route.fragments.map(fragment => fragment.node)]

        return actNodes.includes(wantedNode)
    }
}
/**
 * @param {string} path
 */
export const resolveNode = path => {
    const { node } = contexts.fragment
    const { router } = contexts
    return traverseNode(node, path, router)
}

/**
 *
 * @param {RNodeRuntime} node
 * @param {string} path
 * @param {Router} router
 * @returns {RNodeRuntime}
 */
export const traverseNode = (node, path, router) =>
    path.startsWith('/') ? router.rootNode.traverse(`.${path}`) : node.traverse(path)

/**
 * @template {Function} T
 * @template U
 * @param {T} callback
 * @returns {Readable<T extends () => infer U ? U : any>}
 */
const pseudoStore = callback => ({
    subscribe: run => {
        run(callback())
        return () => {}
    },
})

export const context = pseudoStore(() => contexts.fragment)

export const node = pseudoStore(() => get(context).node)

export const meta = pseudoStore(() => get(node).meta)

/** @type {Readable<Route>} */
export const activeRoute = {
    subscribe: run => contexts.router.activeRoute.subscribe(run),
}

/** @type {Readable<Route>} */
export const pendingRoute = {
    subscribe: run => contexts.router.pendingRoute.subscribe(run),
}

/**@type {Readable<function(AfterUrlChangeCallback):any>} */
export const afterUrlChange = {
    subscribe: run => {
        const hookHandles = []
        /**
         * @param {AfterUrlChangeCallback} callback
         */
        const register = callback => {
            const unhook = contexts.router.afterUrlChange(callback)
            hookHandles.push(unhook)
            return unhook
        }
        run(register)
        return () => hookHandles.map(unhook => unhook())
    },
}

/**@type {Readable<function(BeforeUrlChangeCallback):any>} */
export const beforeUrlChange = {
    subscribe: run => {
        const hookHandles = []
        /**
         * @param {BeforeUrlChangeCallback} callback
         */
        const register = callback => {
            const unhook = contexts.router.beforeUrlChange(callback)
            hookHandles.push(unhook)
            return unhook
        }
        run(register)
        return () => hookHandles.map(unhook => unhook())
    },
}

/**
 * @callback getDirectionCB
 * @param {RNodeRuntime=} boundary
 * @param {Route=} newRoute
 * @param {Route=} oldRoute
 * @returns {'first'|'last'|'same'|'next'|'prev'|'higher'|'lower'|'na'}
 */

/**
 * @type {getDirectionCB & Readable<ReturnType<getDirectionCB>>}
 */
export const getDirection = (boundary, newRoute, oldRoute) => {
    if (!newRoute) newRoute = get(context).route
    if (!oldRoute) oldRoute = newRoute.router.lastRoute

    if (!oldRoute) return 'first'

    const mrcaInfo = getMRCA(newRoute.leaf.node, oldRoute.leaf.node)

    let newNode = mrcaInfo.descendants1[0]
    let oldNode = mrcaInfo.descendants2[0]

    if (![newNode, ...(newNode?.ancestors || [])].includes(boundary)) return 'last'
    if (![oldNode, ...(oldNode?.ancestors || [])].includes(boundary)) return 'first'

    if (oldNode === newNode) return 'same'
    if (oldNode.meta.children?.includes(newNode.name)) return 'higher'
    if (newNode.meta.children?.includes(oldNode.name)) return 'lower'
    if (oldNode.meta.order < newNode.meta.order) return 'next'
    if (oldNode.meta.order > newNode.meta.order) return 'prev'
    return 'na'
}

getDirection.subscribe = (run, invalidate) => {
    const { router, fragment } = contexts

    // WHY IS THERE A BOUNDARY??? MAKES NO SENSE
    const boundary = fragment.node.parent
    return derived(router.activeRoute, $route => {
        return getDirection(boundary, $route, $route.router.lastRoute)
    }).subscribe(run, invalidate)
}
