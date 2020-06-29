<script>
  export let id;
  import { url } from "@sveltech/routify";
</script>

<style>
  a {
    font-size: 1.5em;
    padding: 12px 24px;
  }
</style>

<div class="card" style="width: 512px;">
  <h1>{id}</h1>
</div>

<br />

<a href={$url('../../../home')}>Go home</a>
<a href={$url('../../')}>Go back</a>
