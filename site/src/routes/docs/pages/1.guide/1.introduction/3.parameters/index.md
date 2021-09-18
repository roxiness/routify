<script>
    import { resolveNode } from '@roxi/routify'
    import FilesViewer from '#cmp/FilesViewer.svelte'
    import Example from '#cmp/Example.svelte'
</script>

Parameters in Routify are plain URL queries, eg. `/posts?page=1`. 

Parameters can be accessed in Routify with the $params helper, eg. `$param.page`. 

To generate a URL, we have the $url helper: `$url('/posts', {page: 1})`. This would produce the string `/posts?page=1`

#### Syntactical sugar

Often we want our URLs to look a little more appealing. For instance, `/posts/1` would look nicer than the previous example.

To accomplish this we can add a dynamic page or module, `/posts/[page].svelte`.

Routify knows which pages are dynamic and will automatically output the correct URL when using $url. For this case `$url('/posts/', {page: 1, theme: 'dark'})` would output `/posts/1?theme=dark`.


<Example path="../example" title="Parameters example" />


#### Spread parameters

Sometimes parameters are variadic and can take multiple arguments. For this we can use spread operators, eg:  `people/[...names].svelte`. Here `/people/john/peter/paul` would return `['john', 'peter', 'paul']` from $params.


<Example path="../example.2" title="Spread operator example" />
