<script>
  import { url } from "@sveltech/routify";
</script>



<div class="layout-container">
  <div class="card">
    <a href={$url('./grandchild')}>Grandchild</a>

    <slot>
      <!-- optional fallback -->
    </slot>
  </div>
</div>
