
<!-- routify:meta order=20 -->

Metadata is the heart of Routify. Each page and module has its own metadata. Metadata can be accessed without loading or visiting the component and it can contain anything from Routify settings to custom data.

### Using meta for custom logic
Say you wanted to build auto generated navigation, but you don't want unpublished pages to be included. To solve this we can add a custom metadata prop as such
```
<!-- routify::meta draft=true -->
```

In our navigation generation we can then filter pages and modules based on our new custom property.

```html
{#each nodes.filter(node => !node.meta.draft) as node}
  <a href={node.path} >{node.name}</a>
{/each}
```

---

### Writing metadata

#### Inlined

Metadata can be written as HTML comments.
```
<!-- routify::meta property=[value] -->
```
The value is parsed as a JSON value. If the value is omitted it will set to true. Hence `property=true` can be written simply as `property`.