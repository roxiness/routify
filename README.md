# svelte-filerouter

###### Minimalist file router inspired by [Sapper router.](https://sapper.svelte.dev/docs#File_naming_rules)






## To install

``npm i -D svelte-filerouter``


```html
<!--App.svelte-->

<script>
    import { Router } from "svelte-filerouter";
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
fileRouter accepters the following parameters:

``appFile: path/to/App.svelte`` (Defaults to ./src/App.svelte)

``pages: path/to/pages`` (Defaults to ./src/pages)

``ignore: ['ignoreme']`` (Files and dirs. Can be string or array. Interpreted as regular expression)


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
Both examples below are reactive

```html
<!-- src/pages/admin/[business]/[project].svelte-->
<script>
    export let route //current route
    export let routes //all routes
</script>

<a href="my/path">go somewhere</a>

<div>Business: {route.params.business}</div>
<div>Project: {route.params.project}</div>
```

route(s) can also be accessed like this
``import { route, routes } from "svelte-filerouter"``
(``route`` is reactive)


<a href="my/path">go somewhere</a>

<div>Business: {$route.params.business}</div>
<div>Project: {$route.params.project}</div>
```

### Props
Props can be passed through the ``scopes`` prop.
```html
<!-- src/pages/posts/_layout.svelte -->
<script>
    import posts from posts.js
    export let route;
    $: { postId } = route.params;
    $: post = posts[postId]
</script>
<slot scoped={{post}} />
```
Props passed through ``scopes`` are available to all nested components served by the router. Props can be accessed directly or through the ``scoped`` prop.
```html
<!-- src/pages/posts/[postId]/index.svelte -->
<script>
    export let post
</script>
<h1>{post.title}</h1>
<div>{body}</div>
```

## Examples
https://github.com/jakobrosenberg/svelte-filerouter-example

## Notes
- ``<a href="my/path">`` tags are handled by svelte-router

## Roadmap
- ``<link path="pathname" params={params}>`` or similar for normalized link handling. As well as helper script to generate url from pathname and parameters.
- Example project

## Issues
Feel free to open an issue or a pull request, if there's anything you think could be improved.
