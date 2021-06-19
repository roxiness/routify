<script>
    import { Router, InternalReflector } from '@roxi/routify'
</script>

<Router name="example" offset url="/experiments/buildtime/example" urlReflector={InternalReflector} />

# Buildtime

Routify supports buildtime data through meta files.

Buildtime data can be dynamically imported by setting `split` to true

**experiments/buildtime.md**
```html
<script>
    export let context
    const {meta} = context.node
</script>

<div>
    <strong>Luke:</strong>
    {meta.luke.name}
</div>
<div>
    {#await meta.darth then data}
        <strong>Darth:</strong>
        {data.name}
    {/await}
</div>
```

**experiments/buildtime.meta.js**
```javascript
import axios from 'axios'

export default async context => ({  
    // preloaded with app
    luke: (await axios.get('https://swapi.dev/api/people/1/')).data,

    // dynamically imported
    darth: {
        value: (await axios.get('https://swapi.dev/api/people/5/')).data,
        split: true,
    }    
})

```

