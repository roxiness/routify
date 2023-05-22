# Routify 3


## Install

Create a new Routify project with

    npx @roxi/routify@next create myapp

## Using Routify

#### Creating a router

Basic

```html
<script>
    import { Router } from '@roxi/routify'
    import routes from '../.routify/routes.default.js'
</script>

<Router {routes} />
```

[Docs](https://v3.routify.dev/)
