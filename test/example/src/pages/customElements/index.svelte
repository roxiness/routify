<script>
  import { url } from "@roxi/routify";

  if(customElements.get('wc-link-simple') === undefined) {
    customElements.define("wc-link-simple", class extends HTMLElement {
      constructor() {
        const innerHTML = `<a href=${$url("./linkSimple")}>wc link simple</a>`;
      super()
          .attachShadow({mode: "open"})
          .innerHTML = innerHTML;
      }
    })
  }

  if(customElements.get('wc-link-deep') === undefined) {
    customElements.define("wc-link-deep", class extends HTMLElement {
      constructor() {
      const innerHTML = `<div><a href=${$url("./linkDeep")}> <span> <h3>wc link deep</h3> </span></a></div>`;
      super()
          .attachShadow({mode: "open"})
          .innerHTML = innerHTML;
      }
    })
  }
  if(customElements.get('wc-link-slot') === undefined) {
    customElements.define("wc-link-slot", class extends HTMLElement {
      constructor() {
      const innerHTML = `<div><slot/></div>`;
      super()
          .attachShadow({mode: "open"})
          .innerHTML = innerHTML;
      }
   })
  }
	
</script>
<wc-link-simple></wc-link-simple>
<wc-link-deep></wc-link-deep>
<wc-link-slot>
  <a href={$url("./linkSlot")}> 
    <span> <h3>wc link slot</h3> </span>
  </a>
</wc-link-slot>