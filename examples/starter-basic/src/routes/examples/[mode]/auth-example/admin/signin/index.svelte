<!-- routify:meta _isProtected=false -->
<script>
    import Password from '@/components/PasswordInput.svelte'
    import { auth } from '../../__store'
    import { goto } from '@roxi/routify'

    let username = 'admin'
    let password = 'password'

    const handleSubmit = () => auth.signin(username, password)

    $: if (!$auth.isGuest) $goto('../..')
</script>

<div class="login">
    <div class="card">
        <form on:submit|preventDefault={handleSubmit}>
            <header>Sign in</header>
            <label>
                Username
                <input name="username" bind:value={username} placeholder="username" />
            </label>

            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>
                Password
                <Password bind:value={password} />
            </label>

            <button>Submit</button>
        </form>
    </div>
</div>

<style>
    .card {
        box-shadow: var(--shadow-6);
        background: var(--surface-1);
        padding: 2rem 4rem 3rem;
        border-radius: var(--radius-2);
    }
    .login {
        display: grid;
        place-items: center;
        height: 100%;
        font-size: x-large;
    }
    header,
    button {
        grid-column: 1/-1;
    }

    form {
        display: grid;
        grid-template-columns: auto auto;
        gap: 1rem;
    }
    label {
        display: contents;
    }
</style>
