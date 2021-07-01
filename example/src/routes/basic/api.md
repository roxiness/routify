## Metadata
Metadata represents page and module specific data that is available at runtime regardless of whether the page or module has been loaded.

It can be used for custom fields such as 

#### Inline
Metadata can be added to a page or module by adding a HTML comment:
```html
<!-- routify:meta order=4 -->
```

#### External
Metadata can be stored in external files by creating an identically named file with a `.meta.js` extension.

```javascript

```

## Node traversal
Node traversal is a handy way to link or get content, such as meta, from other nodes.

#### Using `resolveNode`
```javascript
import { resolveNode } from '@roxi/routify'

const aParentNode = resolveNode('..')
const aSiblingNode = resolveNode('../sibling')
const aChildNode = resolveNode('./child')
```

_Should we resolve sibling nodes through `../path` or `./path`?_

#### Using node tree
```javascript
import { context } from '@roxi/routify'

const aSiblingNode = $context.node.parent.children.example
```
