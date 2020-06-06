<script>
  import { url } from "@sveltech/routify";
</script>

<p>V1.1 has only one file: feature2.svelte</p>
<p>The rest are handled with _fallback.svelte, which redirects to v1</p>

<code>
  <pre>
    /** _fallback.svelte **/
    import {`{(goto, leftover)}`} from '@sveltech/routify'
    $goto('../../v1/'+$leftover, null, true, true)
  </pre>
</code>

<a href={$url('./feature1')}>Feature 1</a>
<a href={$url('./feature2')}>Feature 2</a>
<a href={$url('./feature3')}>Feature 3</a>

<slot>
  <!-- optional fallback -->
</slot>
