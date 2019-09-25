# svelte-filerouter [WiP]

###### Minimalist file router inspired by [Sapper router.](https://sapper.svelte.dev/docs#File_naming_rules)






## To install

``npm i -D svelte-filerouter``


```html
<!--App.svelte-->

<script>
    import Router from "svelte-filerouter";
</script>

<Router />

```

```javascript
// rollup.config.js
import { fileRouter } from 'svelte-filerouter'
...
    plugins: [
        fileRouter({}),
...

```


## Guide

#### File scheme

###### Basic
``src/pages/about.svelte`` corresponds to ``/about``

###### Parameters
``src/pages/admin/[business].svelte`` corresponds to ``/admin/:business``

###### To exclude
``src/admin/_navbar.svelte`` corresponds to nothing as _prefixed files are ignored.

###### Layouts
Layout files are named ``_layout.svelte`` and apply to all adjacent and nested svelte files. A file can have multiple layouts if multiple layouts are recursively present in parent folders.

#### Accessing route and parameters

```html
<!-- src/pages/admin/[business]/[project]-->
<script>
	export let route
</script>


<div>Business: {route.params.business}</div>
<div>Project: {route.params.project}</div>
```
