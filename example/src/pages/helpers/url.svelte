<script>
    import {url} from '@roxi/routify'
    let foo = "foo"
    let param = 'init'

    // setTimeout(()=>{ param = "bar" }, 500)

    const urls = {
        none: '',
        plain: './path/to',
        withParam: './path/:param',
        parent: './',
        grantParent: '../',
        sibling: './sibling',
        named: 'named-path',
        unmatchedNamed: 'unmatched-named-path'
    }
</script>

<style>
    a {font-weight: bold}
    </style>

<div>
    <input type="text" bind:value={param} />
</div>
<button on:click="{()=>param = 'updated'}" >set param to "updated"</button>

{#each Object.entries(urls) as [name, path]}
<h3>{name}</h3>
<div><a href={$url(path)} class="url-{name}-prop" >prop</a> {$url(path)}</div>
<div><a href={path} use:$url class="url-{name}-use" >use</a> {$url(path)}</div>

<div><a href={$url(path, {foo, param})} class="url-{name}-prop-param" >prop-param</a>{$url(path, {foo, param})}</div>
<div><a href={path} use:$url={{foo, param}} class="url-{name}-use-param" >use-param</a>{$url(path, {foo, param})}</div>
{/each}

<!-- routify:options name="named-path" -->