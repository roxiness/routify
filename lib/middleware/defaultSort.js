const LC_OPTS = { numeric: true, sensitivity: 'base' }

module.exports = sort

function sort(payload) {
  const { tree, options } = payload
  const comparer = (options || {}).compareSiblings || compareFiles
  sortChildren(tree, comparer)
}

function sortChildren(parent, comparer) {
  if (!parent.children || !parent.children.length) { return }
  parent.children.sort(comparer)
  for (const child of parent.children) {
    sortChildren(child, comparer)
  }
}

function compareFiles(a, b) {
  if (a.isMeta && b.isMeta) { return 0 }
  // Sort by index first
  const indexDiff = (a.meta.index || 0) - (b.meta.index || 0)
  if (indexDiff === 0) {
    // Index same, sort by title
    const titleDiff = (a.meta.title || '').localeCompare((b.meta.title || ''), undefined, LC_OPTS)
    if (titleDiff === 0) {
      // Title same, sort by path
      return a.path.localeCompare(b.path, undefined, LC_OPTS)
    }
    return titleDiff
  }
  return indexDiff
}
