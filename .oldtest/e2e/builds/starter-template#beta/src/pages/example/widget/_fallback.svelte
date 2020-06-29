<script>
  import CrudWidget from "../_components/CrudWidget/Index.svelte";
  import { users } from "../_data";
</script>

<div style="text-align: center">
  <p>
    By using a _fallback.svelte in example/widget, we can grab the leftover URL
    and pass it to an embedded widget.
  </p>

  <p>Alternatively, the widget can grab the leftover URL itself.</p>
  <p>This allows for reusable navigatable components.</p>
</div>

<CrudWidget data={users} />
