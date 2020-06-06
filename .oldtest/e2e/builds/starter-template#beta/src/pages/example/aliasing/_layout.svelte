<script>
  import { url } from "@sveltech/routify";
</script>

<div style="text-align: center">
  <div style="font-weight: bold">
    <a href={$url('./')}>Aliasing</a> |
    <a href={$url('./v1')}>V1</a> |
    <a href={$url('./v1.1')}>V1.1</a>
  </div>

  <slot>
    <!-- optional fallback -->
  </slot>
</div>
