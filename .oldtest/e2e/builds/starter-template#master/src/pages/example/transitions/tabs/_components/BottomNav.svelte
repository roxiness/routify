<script>
  import { url, isActive } from "@sveltech/routify";
  export let urls, height;
  let linkElems = [];
  let overlay;
  let clientWidth
  $: urlsWithElem = linkElems.map((elem, i) => ({ ...urls[i], elem }));
  $: activeUrl = urlsWithElem.find(({active}) => active)
  $: if (overlay && clientWidth && activeUrl) copyDimensions(activeUrl.elem, overlay);
  $: color = activeUrl && activeUrl.color

  function copyDimensions(source, target) {
    target.style.left = source.offsetLeft + "px";
    target.style.top = source.offsetTop + "px";
    target.style.width = source.clientWidth + "px";
    target.style.height = source.clientHeight + "px";
  }

  const saveElement = el => (linkElems = [...linkElems, el]);
</script>

<style>
  nav {
    width: 100%;
    background: white;
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    justify-content: space-evenly;
  }
  a {
    padding: 0 16px;
    line-height: 100%;
    font-weight: 500;
    color: #aaa;
    text-transform: uppercase;
    text-decoration: none;
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 10;
    transition: all 0.8s;
    /* transition-delay: 0.05s */
  }
  a.active {
    color: #fff;
  }
  .overlay {
    position: absolute;
    /* background: #555; */
    transition: 0.3s all;
    background: linear-gradient(
          rgba(0, 0, 0, 0.15), 
          rgba(0, 0, 0, 0.15)
        )
  }
</style>

<nav bind:clientWidth>
  {#each urls as { name, path, active, href }, i}
    <a
      style="line-height: {height}"
      {href}
      class:active
      use:saveElement>
      {name}
    </a>
  {/each}
  <div class="overlay" bind:this={overlay} style="background-color: {color}" />
</nav>
