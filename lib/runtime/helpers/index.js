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
    return lineage1.find(node => lineage2.includes(node))
}

export const getPath = (node1, node2) => {
    const lineage1 = [node1, ...node1.ancestors]
    const lineage2 = [node2, ...node2.ancestors]
    const mrca = getMRCA(node1, node2)
    const backtrackSteps = lineage1.indexOf(mrca)
    const backtrackStr = backtrackSteps ? '../'.repeat(backtrackSteps) : ''
    const forwardSteps = lineage2.indexOf(mrca)
    const forwardStepsStr = lineage2
        .slice(0, forwardSteps)
        .reverse()
        .map(n => n.name)
        .join('/')
    return backtrackStr + forwardStepsStr
}

/**
 * @callback Goto
 * @param {string} path relative, absolute or named URL
 * @param {Object.<string, string>=} userParams
 * @param {Partial<$UrlOptions & RouteState>=} options
 * @type {Readable<Goto>} */
export const goto = {
    subscribe: (run, invalidate) => {
        const { router } = contexts
        return derived(url, $url => (path, userParams, options) => {
            const defaults = { mode: 'push', state: {} }
            options = { ...defaults, ...options }
            const newUrl = $url(path, userParams, options)
            router.url[options.mode](newUrl, options.state)
        }).subscribe(run, invalidate)
    },
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
 */

/**
 * @typedef {Partial<{
 *  dontscroll: boolean,
 *  dontsmoothscroll: boolean,
 * [key:string]: *
 * }>} RouteState
 */

/**
 * @typedef {(<T extends string | HTMLAnchorElement>(
 *   inputPath: T,
 *   userParams?: { [x: string]: string; },
 *   options?: Partial<$UrlOptions>
 * ) => T extends HTMLAnchorElement ? void : string)} Url
 */

/**
 * @typedef {((
 *   inputPath: string,
 *   userParams?: { [x: string]: string; },
 *   options?: Partial<$UrlOptions>
 * ) => string)} UrlFromString
 */

/**
 * @type {Readable<Url>}
 */
export const _url = {
    subscribe: (run, invalidate) => {
        const { fragment, router } = contexts

        return derived(fragment.params, $params => {
            return createUrl(fragment.fragment, router)
        }).subscribe(run, invalidate)
    },
}

/**
 * @type {Readable<Url>}
 */
export const url = {
    subscribe: (run, invalidate) => {
        let InitialElem, initialParams, initialPath

        const updateHref = $url =>
            InitialElem.setAttribute('href', $url(initialPath, ...initialParams))

        return derived(_url, $url => {
            if (InitialElem) {
                // if we're dealing with an already set anchor element, set the href
                updateHref($url)
            }

            // todo for some reason we always need to return this function, but it really shouldn't be necessary when an elem has been set
            return (pathOrElem, ...params) => {
                // if we're dealing with a string, return the rendered url
                if (typeof pathOrElem != 'object') {
                    return $url(pathOrElem, ...params)
                }

                // if we're dealing with an anchor element, store it
                InitialElem = pathOrElem
                initialParams = params
                initialPath = InitialElem.getAttribute('href')
                updateHref($url)
            }
        }).subscribe(run, invalidate)
    },
}

/**
 *
 * @param {RouteFragment} fragment
 * @returns {UrlFromString}
 */
export const createUrl =
    (fragment, router) =>
    /** @type {UrlFromString} */
    (_inputPath, userParams = {}, options = {}) => {
        const route = fragment.route
        // const route = fragment.route || router.activeRoute.get()

        // in case we swapped the routes tree (rootNode), make sure we find
        // the node that corresponds with the previous origin
        // otherwise mrca will break as there's no shared ancestor
        const originNode = router.rootNode.traverse(fragment.node.path)

        const inputPath = _inputPath.replace('$leaf', route?.url || fragment.node.path)

        // we want absolute urls to be relative to the nearest router. Ironic huh
        const offset = inputPath.startsWith('/') ? router.rootNode.path : ''
        const targetNode = originNode.traverse(
            offset + inputPath, // path
            !options.strict, // allowDynamic
            options.includeIndex, // includeIndex
            options.silent, // silent
        )
        if (!targetNode) {
            console.error('could not find destination node', inputPath)
            return
        }
        // get lowest common ancestor
        const mrca = getMRCA(targetNode, router.rootNode)
        const path = ('/' + getPath(mrca, targetNode)).replace(/\/index$/, '/')

        const params = {
            ...inheritedParams(targetNode, route || router.activeRoute.get()),
            ...userParams,
        }

        const urlHandler = obj => router.queryHandler.stringify(obj, route)
        const internalUrl = populateUrl(path, params, urlHandler)

        const externalUrl = router.getExternalUrl(internalUrl)
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
        return derived(
            [contexts.router.params, contexts.fragment.params],
            ([routerParams, fragmentParams]) => ({ ...routerParams, ...fragmentParams }),
        ).subscribe(run, invalidate)
    },
}

/**
 * @callback IsActive
 * @param {String=} path
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
 * @param {Object.<string, string>} params
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
    return (path, params = {}, options = {}) => {
        const { recursive } = { recursive: true, ...options }
        const route = router.activeRoute.get()

        const chainOptions = {
            rootNode: router.rootNode,
            allowDynamic: false,
            includeIndex: false,
        }

        const allWantedParamsAreInActiveChain = Object.entries(params).every(
            ([key, value]) => route.params[key] === value,
        )
        if (!allWantedParamsAreInActiveChain) return false

        const wantedNode = path.startsWith('.')
            ? fragment.node.traverse(path)
            : router.rootNode.getChainTo(path, chainOptions).pop().node

        const actNodes = [...route.fragments.map(fragment => fragment.node)].reverse()
        return recursive ? actNodes.includes(wantedNode) : actNodes.pop() === wantedNode
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
