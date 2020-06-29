<script>
  import { url, isActive } from "@sveltech/routify";
  const _links = [
    ["./index", "Home"],
    ["./modal", "Modal"],
    ["./reset", "Reset"],
    ["./layouts", "Layouts"],
    ["./widget", "Widget"],
    ["./aliasing", "Aliasing"],
    ["./404", "404"],
    ["./api", "Api"],
    ["./app", "App"],
    ["./transitions/tabs", "Transitions"]
  ];
</script>

<style>
  aside {
    text-align: center;
  }
  .nav {
    margin: 16px;
    padding: 16px;
    border-radius: 4px;
    background: white;
    box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.075);
    display: inline-block;
  }
  .link {
    padding: 0 16px;
    width: 64px;
    display: inline-block;
  }
  .backlink {
    position: absolute;
    left: 16px;
    color: #C848C1;
    font-weight: bold;
  }
  .active {
    font-weight: bold;
  }
</style>

<aside>
  <div class="nav">
    <a class="backlink" href={$url('/')}>&#8656; BACK TO APP</a>
    {#each _links as [path, name]}
      <a class="link" class:active={$isActive(path)} href={$url(path)}>
        {name}
      </a>
    {/each}
  </div>
</aside>
