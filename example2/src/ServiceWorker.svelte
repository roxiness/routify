<script>
  let prompt = false
  let justInstalled = false

  if ('serviceWorker' in navigator) {
    import('workbox-window').then(async ({ Workbox, messageSW }) => {
      const wb = new Workbox('/sw.js')

      wb.addEventListener('installed', () => (justInstalled = true))
      wb.addEventListener('externalinstalled', () => (justInstalled = true))
      wb.addEventListener('waiting', showPrompt)
      wb.addEventListener('externalwaiting', showPrompt)
      const registration = await wb.register()

      function showPrompt(event) {
        prompt = {
          accept: async e => {
            e.preventDefault()
            wb.addEventListener('controlling', event =>
              window.location.reload()
            )
            if (registration && registration.waiting) {
              messageSW(registration.waiting, { type: 'SKIP_WAITING' })
            }
          },
        }
      }
    })
  }
</script>

<style>
  a {
    text-decoration: none;
  }
  a.close {
    position: absolute;
    top: 4px;
    right: 4px;
    line-height: 10px;
  }
  div {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 9999;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    border-radius: 0 4px 0 0;
  }
  p {
    margin: 16px 32px;
  }
</style>

{#if prompt}
  <div>
    <p>
      Update available.
      <a href="#update-service-worker" on:click={prompt.accept}>Update</a>
      <a href="#close" class="close" on:click={() => (prompt = false)}>×</a>
    </p>
  </div>
{/if}

{#if justInstalled}
  <div id="justInstalled" >Just installed</div> 
{/if}
