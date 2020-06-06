<script>
  import { user } from "../_store.js";
  import { goto, url } from "@sveltech/routify";

  let username = "anything";
  let password = "goes";

  function login() {
    $user = { username };
    /** We want to $goto our current location.
     *  Since we're now logged in, we shouldn't be redirected to this login page again.
     * **/
    $goto(window.location.href);
  }
</script>

<div style="width: 256px; margin: 128px auto; text-align: center">
  <h1>Login</h1>
  <input type="text" bind:value={username} />
  <br />
  <input type="text" bind:value={password} />
  <br />
  <button on:click={login}>Submit</button>

  <br />
  <br />
  <br />
  <p>
    This login page is actually located at
    <a href={$url()}>{$url()}</a>
  </p>
  <p>
    You are seeing it here, because we're using $goto with the static option
    enabled. This renders the login page, without changing the URL in the
    browser.
  </p>
  <p>
  On submit, we're "redirected" to the current URL in your browser.
  </p>
</div>
