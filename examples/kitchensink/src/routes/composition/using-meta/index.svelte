<script>
    import { url } from '@roxi/routify'
</script>

<h1>Using-meta</h1>

<p>
    This file uses embeded metadata to reset the render tree. <code
        >&lt;!-- routify:meta reset --&gt;</code>
</p>
<p>
    Alternatively <code>&lt;!-- routify:meta reset="custom" --&gt;</code>
    or <code>&lt;!-- routify:meta reset="custom+" --&gt;</code>
    could have been used to prepend the custom module.
</p>

<a href={$url('../..')}>Go back</a>
<!-- routify:meta reset -->
