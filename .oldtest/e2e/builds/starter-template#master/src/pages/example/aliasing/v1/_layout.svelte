<script>
    import { url } from '@sveltech/routify'
</script>

<p>V1 has three files, which can be seen in the links below </p>


<a href={$url('./feature1')}>Feature 1</a> | 
<a href={$url('./feature2')}>Feature 2</a> |
<a href={$url('./feature3')}>Feature 3</a>



<slot>
  <!-- optional fallback -->
</slot>