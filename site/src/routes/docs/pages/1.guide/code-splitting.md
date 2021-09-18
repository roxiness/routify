<!-- routify:meta order=100 -->


#### Code-splitting a file (or all files within a module)
```
<!-- routify::meta split -->
```

## Bundling
Sometimes you don't want each file imported individually. Maybe you have an `/admin` module which should load as a separate bundle.

#### Bundling a module
```
<!-- routify::meta bundle -->
```

Bundling within a bundle is also possible. This will create two smaller bundles instead of one big bundle. 


### [TODO should we add some graphics to explain the concepts?]