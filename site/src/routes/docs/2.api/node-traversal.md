Node traversal is a great way to link or get content, such as meta, from other nodes.

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
