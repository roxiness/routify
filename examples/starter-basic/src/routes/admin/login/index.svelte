<!-- routify:meta isProtected=false -->
<script>
    import Password from '@/components/PasswordInput.svelte'
    import { auth } from '@/store'
    import { goto } from '@roxi/routify'

    let username = 'admin'
    let password = 'password'

    const handleSubmit = () => auth.signin(username, password)

    $: if (!$auth.isGuest) $goto('../..')
</script>

<div class="login">
    <form on:submit|preventDefault={handleSubmit}>
        <header>Sign in</header>
        <label>
            Username
            <input name="username" bind:value={username} placeholder="username" />
        </label>

        <label>
            Password
            <Password bind:value={password} />
        </label>

        <button>Submit</button>
    </form>
</div>
