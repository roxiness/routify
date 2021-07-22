<!-- routify:meta index=99 -->

# Code-splitting

#### Code-splitting a file
```
<!-- routify::meta split -->
```

---

#### Code-splitting all files in a module
To use a meta option for all descendent files, we can use the `scoped` directive.
```
<!-- routify::meta split|scoped -->
```
Adding the above meta in the root `_module.svelte` will dynamically import every single page and module individually.

## Bundling
Sometimes you don't want each file imported individually. Maybe you have an `/admin` module which should load as a single bundle.

#### Bundling a module
```
<!-- routify::meta bundle -->
```

Bundling within a bundle is also possible. This will create two smaller bundles instead of one big bundle. 


### [TODO should we add some graphics to explain the concepts?]