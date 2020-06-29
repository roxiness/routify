<script>
  import { url } from "@sveltech/routify";
</script>

<style>
  .layout-container :global(.card) {
    width: 66%;
    margin: 16px;
    padding: 16px;
    border-radius: 4px;
    background: white;
    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.075);
    display: inline-block;
  }
  * > :global(.layout-container) {
    text-align: center;
  }
</style>

<div >
  <div class="layout-container">
    <div class="card">
      <a href={$url('./child')}>Child</a>

      <slot>
        <!-- optional fallback -->
      </slot>
    </div>
  </div>
</div>
