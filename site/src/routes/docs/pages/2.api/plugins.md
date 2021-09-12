
Plugins can be created with the following structure

```javascript
export default options => ({
    name: 'string',
    before: 'string', // optional plugin name this plugin should run before
    after: 'string', // optional plugin name this plugin should run after
    build: ({ instance }) => void
})
```

---

#### Example

```javascript
// this plugin sorts routes by the index prefixed to their names
// eg. 1.guide.svelte, 2.api.svelte
export default options => ({
    name: 'indexByName',
    
    // we want to run our plugin before we write our routes to disk
    before: 'exporter', 
    
    
    build: ({ instance }) => {

        // iterate over all nodes
        instance.nodeIndex.forEach(node => {

            // if our node name matches 123.foo
            // set the name to foo and the meta index to 123
            const matches = node.name?.match(/^(\d+)\.(.+)/)
            if (matches) {
                const [, index, name] = matches
                node.name = name
                node.meta.index = index
            }
        })
    }
})
```

---

#### Using a plugin

**package.json**
```json
{
    "routify": {
        "plugins": [
            "indexByName"
        ]
    }
}
```

---

**package.json with options**
```json
{
    "routify": {
        "plugins": [
            {
                "path": "indexByName",
                "options": { }
            }
        ]
    }
}
```

---

**routify.config.js**
```javascript
import indexByName from './path/to/plugin'

export default {
  plugins: [
      indexByName({/** options*/})
  ]
}
```