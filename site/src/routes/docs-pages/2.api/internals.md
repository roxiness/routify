<script>
    const open = '{'
    const close = '}'
</script>

<!-- routify:meta status="draft" -->


Routify is built up by a handful of different classes

#### Instance (RoutifyRuntime)
Collections of routes
[Should this be renamed Collections?]

#### Router
The engine of Routify. The router handles the composition of the rendered components.

#### Node
Nodes are the heart of Routify and can be thought of as a virtual file system. Nodes can be accessed from the browser address bar using the the path you would have used in a file system. Eg. the path `info/contact.svelte` and `info/contact/index.svelte` can both be accessed at `/info/contact`


For traversal, all nodes are treated like folders, even if they are represented by a file. This allows for all nodes to append new children at runtime.

#### Global
Routify uses a Global class to keep track of all router instances as well as singletons such as the browser adapter.

##### Properties
- **BrowserAdapter(options):{open}toBrowser, toRouter{close}** keeps Routify's URLs synchronized with the browser.
    - **toBrowser(router[]):string** concats the URL of each router into a single string
    - **toRouter(url, router)** called by each router to retrieve the respective URL
    - **instances** 
    - **routers**