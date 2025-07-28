# Routify 3

[Routify.dev](https://routify.dev/)

## Install

Create a new Routify project with

    npm init routify@latest

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

