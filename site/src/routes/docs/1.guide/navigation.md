<script>
export let context
</script>

<!-- routify:meta order=0 -->

# Navigation

---

Navigating in Routify is straight forward and requires no special semantics as Routify works with native `<a>` anchors* and `history.pushState`/`history.replaceState`.

### Exceptions
Routify will not intercept links to other domains or anchors which contain a `target` attribute or are outside Routify's pages and layouts/modules.

To bypass Routify for programmatic navigation, please use `history.pushStateNative` and  `history.replaceStateNative`.

---

### Writing URLs
While writing URLs can be done manually, it's often much easier to use the `$url` helper.

```javascript
$url('/blog/[slug]/comments', {slug: 'welcome', sort: 'descending'})
// outputs /blog/welcome/comments?sort=descending
```
For more information, please see [$url](/api/helpers/url)

---

### Writing URLs from files
Routify lets you iterate over nodes (files) in your project.
```html
<script>
    import { isActive } from '@roxi/routify'
    export let node
    export let nested = 0
</script>

<ul>
    <!-- iterate over each child of the provided node -->
    {#each node.children.indexed as child (child.path)}
        <li>
            <a href={child.path} class:active={$isActive(child.path)}>{child.name}</a>

            <!-- if the node is active and has children, 
            show them by nesting a new instance of this component in itself.
            We could also use the `nested` count to limit the recursive depth. -->
            {#if $isActive(child.path) && child.children.indexed.length}
                <svelte:self node={child} nested={nested + 1} />                
            {/if}
        </li>
    {/each}
</ul>
```
Hint: To retrieve a node, please refer to [nodes](/docs/guide/nodes).

### Helpers

##### $url (path, params, options)

The url helper resolves pages relative to the file in which the helper is used. This is different from native relative URLs which are relative to the current path in the browser's address bar.

