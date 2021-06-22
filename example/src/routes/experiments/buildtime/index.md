<script>
    import { Router, InternalReflector, resolveNode } from '@roxi/routify'
    import MiniBrowser from '#cmp/minibrowser/MiniBrowser.svelte'
    console.log(resolveNode('../example'))
</script>


<Router decorator={MiniBrowser} name="example" offset="../example" url="/" urlReflector={InternalReflector} />


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

