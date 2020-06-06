<script>
  import { draw } from 'svelte/transition'
  let duration = 2000
  let drawing = true
  let show = false
  let error = false
  setTimeout(() => (show = true))
  setTimeout(() => (drawing = false), 1800)
  setTimeout(() => (error = true), 5000)
</script>

<style>
  .container {
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }
  .error {min-height: 100px}
  .svg {
    width: 200px;
    margin: auto;
  }
  path {
    transition: 0.3s ease;
    stroke-width: 1;
    stroke: black;
    stroke-width: 0;
  }
  .svg.drawing path {
    stroke-width: 2;
    fill-opacity: 0;
  }
</style>

<div class="container">
  <div class="svg" class:drawing>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="isolation:isolate"
      viewBox="0 0 1000 1000">
      <defs>
        <clipPath id="_clipPath_40vHZL606H8eXCPAFONHYpjfq1ISybTL">
          <rect width="1000" height="1000" />
        </clipPath>
      </defs>
      <g clip-path="url(#_clipPath_40vHZL606H8eXCPAFONHYpjfq1ISybTL)">
        <linearGradient
          id="_lgradient_2"
          x1="-0.011142038971568513"
          y1="-0.011791871475954507"
          x2="0.9938039543302696"
          y2="0.9909604299907665"
          gradientTransform="matrix(532,0,0,368.749,249,625.251)"
          gradientUnits="userSpaceOnUse">
          <stop
            offset="1.7391304347826086%"
            stop-opacity="1"
            style="stop-color:rgb(255,124,247)" />
          <stop
            offset="100%"
            stop-opacity="1"
            style="stop-color:rgb(255,203,252)" />
        </linearGradient>
        {#if show}
          <path
            transition:draw|local={{ duration }}
            d=" M 564.251 625.251 L 659 720 L 700 675 L 781 994 L 457 921 L 506
            873 L 249 626 L 249 626 L 542.5 626 C 549.812 626 557.065 625.748
            564.251 625.251 Z "
            fill="url(#_lgradient_2)" />
          <linearGradient
            id="_lgradient_3"
            x1="0.13056277056277052"
            y1="0.05232744783306609"
            x2="0.9350649350649348"
            y2="0.7710005350454795"
            gradientTransform="matrix(770,0,0,623,84,3)"
            gradientUnits="userSpaceOnUse">
            <stop
              offset="2.1739130434782608%"
              stop-opacity="1"
              style="stop-color:rgb(241,93,232)" />
            <stop
              offset="100%"
              stop-opacity="1"
              style="stop-color:rgb(184,58,177)" />
          </linearGradient>
          <path
            transition:draw|local={{ duration }}
            d=" M 542.5 215.388 L 84 215.388 L 203 3 L 542.5 3 L 542.5 3 C
            714.422 3 854 142.578 854 314.5 C 854 486.422 714.422 626 542.5 626
            L 249 626 L 364 413.612 L 542.5 413.612 L 542.5 413.612 C 597.201
            413.612 641.612 369.201 641.612 314.5 C 641.612 259.799 597.201
            215.388 542.5 215.388 L 542.5 215.388 L 542.5 215.388 Z "
            fill="url(#_lgradient_3)" />
        {/if}
      </g>
    </svg>
  </div>
  <h1 style="">Generating routes...</h1>
  <div class="error">
    {#if error}
      <h3>Your app should probably have loaded by now</h3>
    {/if}
  </div>
</div>
