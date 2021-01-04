<script>
    import {page} from '@roxi/routify'
</script>

<h1>{$page.title}</h1>
<h3>{$page.__file.path}.{$page.__file.ext}</h3>

<slot/>