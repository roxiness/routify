Metadata represents page and module specific data that is available at runtime regardless of whether the page or module has been loaded.

It can be used for custom fields such as 

#### Inline
Metadata can be added to a page or module by adding a HTML comment:
```html
<!-- routify:meta order=4 -->
```

#### External
Metadata can be stored in external files by creating an identically named file with a `.meta.js` extension.