/**
 * CommonJS implementation of the node middleware helpers.
 *
 * This used to proxy the ESM implementation in `runtime/middleware.js` via the
 * unmaintained `esm` package. Keeping a CJS copy here avoids loaders and works
 * on Node 22+, while still supporting older Node versions.
 */

/**
 * Node middleware
 * @description Walks through the nodes of a tree
 * @example middleware = createNodeMiddleware(payload => {payload.file.name = 'hello'})(treePayload))
 * @param {(payload: any) => any} fn
 */
function createNodeMiddleware(fn) {
	/**
	 * NodeMiddleware payload receiver
	 * @param {TreePayload} payload
	 */
	const inner = async function execute(payload) {
		return await nodeMiddleware(fn, {
			file: payload.tree,
			state: { treePayload: payload },
			scope: {},
		})
	}

	/**
	 * NodeMiddleware sync payload receiver
	 * @param {TreePayload} payload
	 */
	inner.sync = function executeSync(payload) {
		return nodeMiddlewareSync(fn, {
			file: payload.tree,
			state: { treePayload: payload },
			scope: {},
		})
	}

	return inner
}

/**
 * Node walker
 * @param {(payload: any) => any} fn function to be called for each file
 * @param {any=} payload
 */
async function nodeMiddleware(fn, payload) {
	const _file = await fn(payload)
	if (_file === false) return false
	const file = _file || payload.file

	if (file.children) {
		const children = await Promise.all(
			file.children.map(async _child =>
				nodeMiddleware(fn, {
					state: payload.state,
					scope: clone(payload.scope || {}),
					parent: payload.file,
					file: await _child,
				})
			)
		)
		file.children = children.filter(Boolean)
	}

	return file
}

/**
 * Node walker (sync version)
 * @param {(payload: any) => any} fn function to be called for each file
 * @param {any=} payload
 */
function nodeMiddlewareSync(fn, payload) {
	const _file = fn(payload)
	if (_file === false) return false

	const file = _file || payload.file

	if (file.children) {
		const children = file.children.map(_child =>
			nodeMiddlewareSync(fn, {
				state: payload.state,
				scope: clone(payload.scope || {}),
				parent: payload.file,
				file: _child,
			})
		)
		file.children = children.filter(Boolean)
	}

	return file
}

/**
 * Clone with JSON
 * @param {any} obj
 */
function clone(obj) {
	return JSON.parse(JSON.stringify(obj))
}

module.exports = {
	nodeMiddleware,
	nodeMiddlewareSync,
	createNodeMiddleware,
}
