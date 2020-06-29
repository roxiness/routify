<script>
import {url, params} from '@sveltech/routify'
// $: console.log('layout', $params)
</script>

<a href="{$url('./fixed1/param-foo')}">1 foo</a>
<a href="{$url('./fixed1/param-bar')}">1 bar</a>
<a href="{$url('./fixed2/param-foo')}">2 foo</a>
<a href="{$url('./fixed2/param-bar')}">2 bar</a>


<slot><!-- optional fallback --></slot>